const PRO6_SD_PROTOCOL = 610;
const PRO7_SD_PROTOCOL = 710;
const PRO6_CONTROL_PROTOCOL = 600;
const PRO7_CONTROL_PROTOCOL = 700;

const config = {
	master: {
		host: "localhost:60157",
		sd: {
			protocol: PRO7_SD_PROTOCOL,
			password: 'av',
		},
		control: {
			protocol: PRO7_CONTROL_PROTOCOL,
			password: 'control',
		},
	},
	slave: {
		host: "192.168.50.11:60157",
		sd: {
			protocol: PRO7_SD_PROTOCOL,
			password: 'av',
		},
		control: {
			protocol: PRO7_CONTROL_PROTOCOL,
			password: 'control',
		},
	},
};

module.exports = config;
