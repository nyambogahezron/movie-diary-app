const nodemailerConfig = {
	service: 'gmail',
	auth: {
		user: process.env.email,
		pass: process.env.pass,
	},
};

export default nodemailerConfig;
