const Sequelize = require('sequelize');
const sequelize = new Sequelize('csv', 'root', 'root', {
	host: 'localhost',
	dialect: 'mysql'
});

const Policy = sequelize.define('policy', {
	policyID: {
		type: Sequelize.DECIMAL,
		field: 'policy_id'
	}
}, {
	tableName: 'policy',
	timestamps: false
});

module.exports = {
	Policy: Policy
};
