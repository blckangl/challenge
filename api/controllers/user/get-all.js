module.exports = {


  friendlyName: 'Get all',


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


  fn: async function (inputs,exits) {

    try {
      let GET_ALL_USERS_SQL = `SELECT U.id,u.full_name,coalesce(t.subs::integer, 0) isSubbed  from users u 
    left join subscriptions s on s.to = u.id
    left join(select count(*) subs,s.to from subscriptions s where s.subscriber = $1 group by s.to) as t on u.id = t.to  
    where u.id !=$1`;

      let rawResult = await sails.sendNativeQuery(GET_ALL_USERS_SQL, [inputs.id]);

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
