
module.exports = {


  friendlyName: 'Subscribe',


  description: 'Subscribe user.',


  inputs: {
    subscriber: {
      type: 'number',
      required: true
    },
    to: {
      type: 'number',
      required: true
    }
  },


  exits: {
    success: {
      statusCode: 201,
      description: 'New subscription created',
    },
    notAUser: {
      statusCode: 404,
      description: 'User not found',
    },
    error: {
      description: 'Something went wrong',
    },
    notEnoughCredit: {
      description: 'Insiffusant funds',
    },
  },


  fn: async function (inputs, exits) {
    try {
      const subscribedTo = await User.findOne({ id: inputs.to });
      const subscriber = await User.findOne({ id: inputs.subscriber });

      if (!subscribedTo || !subscriber) {
        return exits.notAUser({
          error: `user was not found`,
        });
      }
      if (subscribedTo.type !== 'creator') {
        return exits.notAUser({
          error: `user isnt a creator`,
        });
      }
      if (subscriber.credit <= 0) {
        return exits.notEnoughCredit({
          error: `You dont have enough credit`,
        });
      }

      let IF_SUBSCRIBED_SQL = `
SELECT count(*)
FROM subscriptions
WHERE subscriber = $1 AND subscriptions.to = $2 `;

      let rawResult = await sails.sendNativeQuery(IF_SUBSCRIBED_SQL, [subscriber.id, subscribedTo.id]);

      if(rawResult.rows[0].count>0){
        return exits.notAUser({
          error: `Already sunscribed`,
        });
      }
      let createdSub = await Subscription.create({
        subscriber: subscriber.id,
        to: subscribedTo.id,
      }).fetch();


      return exits.success({
        message: `A subscription has been created with id of ${createdSub.id} successfully.`,
      });
    } catch (error) {
      return exits.error({
        message: 'Oops :) an error occurred',
        error: error.message,
      });
    }

  }


};
