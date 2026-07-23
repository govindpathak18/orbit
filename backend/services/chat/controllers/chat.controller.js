import Conversation from "../models/conversation.model.js";


// create conversation using the user.id present in req headers
export const createConversation = async (req, res) => {

  try {
    const userId = req.headers["x-user-id"]; // from req headers added in gateway

    const conversation = await Conversation.create({
      userId: userId
    });

    res.json(
      conversation
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

}

// returns all conversations of the user present in req headers
export const getConversations = async (req, res) => {

  try {
    const userId = req.headers["x-user-id"];
    const conversations = await Conversation.find({
      userId: userId
    }).sort({updatedAt:-1});

    res.json(
      conversations
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

}



import Message from "../models/message.model.js";


// saves a message to the database
export const saveMessage = async (req, res) => {
  try {
    const {
      conversationId,
      role,
      content,
      images,
      artifacts
    } = req.body;

    const message = await Message.create({
      conversationId,
      role,
      images,
      content,
      artifacts:artifacts || []
    });

    if(!message) return res.json({"message" : "no message to save"})

    res.json(
      message
    );

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

}


// get saved messages of a particular conversation
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId:req.params.id
    }).sort({createdAt:1});

    res.json(
      messages
    );

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}


// update the conversation (title)
export const updateConversation = async (req, res) => {
  try {
    const { conversationId, title } = req.body
    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      title
    })
    res.json(
      conversation
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
}