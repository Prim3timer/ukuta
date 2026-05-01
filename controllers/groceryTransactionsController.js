const GroceryTransaction = require("../models/GroceryTransaction");
const GroceryItems = require("../models/GroceryItem");
const GroceryUser = require("../models/GroceryUser");
const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
// const stripe = require("stripe")(process.env.STRIPE_REAL_LIVE_KEY);

const getAllTransactions = asyncHandler(async (req, res) => {
  try {
    const groceryTransactions = await GroceryTransaction.find();
    if (!groceryTransactions.length) {
      return res.status(400).json("no transaction found");
    }
    res.json(groceryTransactions);
  } catch (error) {
    console.log({ cenk: error });
  }
});

const createNewTransaction = asyncHandler(async (req, res) => {
  const { cashier, cashierID, status, goods, date, grandTotal, cashPaid } =
    req.body;
  if (!goods) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const transactionObject = {
    cashier,
    cashierID,
    goods,
    status,
    date,
    cashPaid,
    grandTotal: grandTotal,
  };
  const dbItems = await GroceryItems.find().exec();
  const newDb = dbItems.map((item) => {
    return item._id;
  });
  // Create and store new item
  const transaction = await GroceryTransaction.create(transactionObject);
  // const trans = dbItems.filter((item) => {
  //   const goodies = goods.find((good) => good._id == item._id);
  //   return goodies;
  // });

  const inventoryUPdate = dbItems.map((item) => {
    goods.map(async (good) => {
      if (item._id == good._id) {
        if (good.index == 1) {
          await GroceryItems.updateOne(
            { _id: good._id },
            {
              // qty: good.numerator < 0 ? item.qty - 1 : item.qty,
              numerator:
                good.numerator - Number(good.qty) < 0
                  ? good.numerator - Number(good.qty) + good.denominator
                  : good.numerator - Number(good.qty),
              qty:
                good.numerator - Number(good.qty) < 0 || good.numerator === 0
                  ? item.qty - 1
                  : item.qty,

              date,
            },
          );
        } else {
          await GroceryItems.updateOne(
            { _id: good._id },
            {
              qty: item.qty - Number(good.qty),
              date,
            },
          );
        }
        const currentItem = await GroceryItems.findById({
          _id: good._id,
        });
        const availableQuantities = [currentItem.qty, currentItem.numerator];
        await GroceryItems.updateOne(
          { _id: good._id },
          { availableQuantities },
        );
      }
    });
  });
  if (transaction) {
    //   //created
    res.status(201).json({ message: `transaction complete` });
  } else {
    res.status(400).json({ message: "Invalid transaction data received" });
  }
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm note exists to delete
  const item = await GroceryTransaction.findById(id).exec();

  if (!item) {
    return res.status(400).json({ message: "Transaction not found" });
  }

  const result = await item.deleteOne();

  const reply = `Transaction '${item.name}' with ID ${item._id} deleted`;

  res.json(reply);
});

const makePayment = asyncHandler(async (req, res) => {
  try {
    const theGoods = req.body.goods;
    console.log({ goods: JSON.stringify(req.body.goods, null, 2) });
    const groceries = await GroceryItems.find();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: theGoods.map((good) => {
        const storeItem = groceries.find((grocery) => grocery._id == good._id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: (storeItem.availablePrices[good.index] * 100) / 1000,
          },
          quantity: good.qty * 1000,
          metadata: {
            id: good._id,
            index: good.index,
          },
        };
      }),
      success_url: `${process.env.SECOND_CLIENT_URL}/#transactions?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SECOND_CLIENT_URL}/#sales`,

      metadata: {
        userId: req.body.cashierID,
      },
    });
    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const thanksAlert = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  console.log({ sessionId });

  const sessions = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent.payment_method"],
  });
  const sessions2 = await stripe.checkout.sessions.retrieve(sessionId);

  const userId = sessions2.metadata.userId;
  const currentUser = await GroceryUser.findById(userId);
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

  const storeItems = await GroceryItems.find();

  if (lineItems) {
    const braxTax = storeItems.map(async (storeItem) => {
      lineItems.data.map(async (lineItem) => {
        const { index, id } = lineItem.metadata;
        if (storeItem._id == id) {
          const storeItem = storeItems.find((storeItem) => storeItem._id == id);
          const firstElement = storeItem.availableQuantities[0];
          const secondElement = storeItem.availableQuantities[1];
          const diff = secondElement - lineItem.quantity;
          console.log({ secondElement, lineQty: lineItem.quantity });
          // storeItem.availableQuantities.splice(index, 1, diff);
          if (index == 1) {
            await GroceryItems.updateOne(
              { _id: id },
              {
                numerator:
                  storeItem.numerator - Number(lineItem.quantity) < 0
                    ? storeItem.numerator -
                      Number(lineItem.quantity) +
                      storeItem.denominator
                    : storeItem.numerator - Number(lineItem.quantity),

                qty:
                  storeItem.numerator - Number(lineItem.quantity) < 0
                    ? storeItem.qty - 1
                    : storeItem.qty,
              },
            );
          } else {
            await GroceryItems.updateOne(
              { _id: id },
              {
                qty: storeItem.qty - Number(lineItem.quantity),
                // date,
              },
            );
          }
          const currentItem = await GroceryItems.findById({
            _id: id,
          });
          const availableQuantities = [currentItem.qty, currentItem.numerator];
          await GroceryItems.updateOne({ _id: id }, { availableQuantities });
          console.log({ lineItemQty: lineItem.quantity });
        }
      });
    });
  }

  const receiptArray = lineItems.data.map((lineItem) => {
    const { unit_amount } = lineItem.price;
    const { index, id } = lineItem.metadata;
    const { amount_subtotal, description, quantity } = lineItem;
    const currentItem = storeItems.find((storeItem) => storeItem._id == id);
    // return lineItem;

    return {
      price: unit_amount / 100,
      total: amount_subtotal / 100,
      name: description,
      qty: quantity,
      index,
      id,
      unitMeasure: currentItem.availableUnitMeasures[index],
    };
  });

  const grandT = receiptArray.reduce((accummulator, total) => {
    return accummulator + total.total;
  }, 0);

  console.log({ receiptArray });

  const transactionObject = {
    cashier: currentUser.username,
    cashierID: currentUser._id,
    goods: receiptArray,
    date: req.body.date,
    grandTotal: grandT,
    last4: sessions.payment_intent.payment_method.card.last4,
    date: req.body.date,
  };
  const transaction = await GroceryTransaction.create(transactionObject);

  res.send(sessionId);
});

// for making sure a transaction is not dublicated as it results in double intventory update.
const getSessionId = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const sessions2 = await stripe.checkout.sessions.retrieve(sessionId);
  const userId = sessions2.metadata.userId;
  // change the sessionId with the latest one.
  const response = await GroceryUser.findOneAndUpdate(
    { _id: userId },
    { sessionId },
  );
  if (response) {
    console.log({ response });
    res.send(response.sessionId);
  }
});

module.exports = {
  getAllTransactions,
  createNewTransaction,
  deleteTransaction,
  makePayment,
  thanksAlert,
  getSessionId,
};
