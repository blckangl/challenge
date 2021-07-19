module.exports = {


  friendlyName: 'Register',


  description: 'Register user.',


  inputs: {
    fullName: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6,
    },
    type: {
      type: 'string',
      isIn: ['creator', 'regular'],
      required:true
    }
  },


  exits: {
    success: {
      statusCode: 201,
      description: 'New user created',
    },
    emailAlreadyInUse: {
      statusCode: 400,
      description: 'Email address already in use',
    },
    incorrectType: {
      statusCode: 400,
      description: 'Incorrect user type',
    },
    error: {
      description: 'Something went wrong',
    },
  },


  fn: async function (inputs,exits) {
    try {
      const lowerEmailAdress = inputs.email.toLowerCase();
      const token = await sails.helpers.strings.random('url-friendly');
      let createdUser = await User.create({
        fullName: inputs.fullName,
        email: lowerEmailAdress,
        type: inputs.type,
        password: inputs.password,
        emailProofToken: token,
        emailProofTokenExpiresAt:
          Date.now() + sails.config.custom.emailProofTokenTTL,
      }).fetch();
      const confirmLink = `${sails.config.custom.baseUrl}/user/confirm?token=${token}`;
      const email = {
        to: createdUser.email,
        subject: 'Confirm Your account',
        template: 'confirm',
        context: {
          name: createdUser.fullName,
          confirmLink: confirmLink,
        },
      };
      // await sails.helpers.sendMail(email);
      return exits.success({
        message: `An account has been created for ${createdUser.email} successfully. Check your email to verify`,
      });
    } catch (error) {
      console.log(error);
      if (error.code === 'E_UNIQUE') {
        return exits.emailAlreadyInUse({
          message: 'Oops :) an error occurred',
          error: 'This email address already exits',
        });
      }
      return exits.error({
        message: 'Oops :) an error occurred',
        error: error.message,
      });
    }



  }


};
