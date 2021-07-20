module.exports = {


  friendlyName: 'Get subscribers',


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
      let GET_SUBSCRIBERS_SQL = `SELECT U.id,u.full_name from users u
      left join subscriptions s on s.subscriber = u.id
      where s.to = $1`;

      let rawResult = await sails.sendNativeQuery(GET_SUBSCRIBERS_SQL, [inputs.id]);

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
