module.exports = {


  friendlyName: 'Get subscriptions',


  description: '',
  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },


  exits: {
    success: {
      statusCode: 201,
      description: 'New subscription created',
    },

    error: {
      description: 'Something went wrong',
    },


  },


  fn: async function (inputs, exits) {

    try {
      let GET_SUBSCRIPTIONS_SQL = `SELECT U.id,u.full_name from users u
      left join subscriptions s on s.to = u.id
      where s.subscriber = $1
      `;

      let rawResult = await sails.sendNativeQuery(GET_SUBSCRIPTIONS_SQL, [inputs.id]);

      return exits.success({
        body: rawResult.rows,
      });
    } catch (error) {
      return exits.error({
        message: 'Oops :) an error occurred',
        error: error.message,
      });
    }

  }


};
