export default function NodemailerConfig() {
	return {
		service: 'gmail',
		auth: {
			user: process.env.email,
			pass: process.env.pass,
		},
	};
}
