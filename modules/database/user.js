module.exports = (sequelize, DataTypes, guildID) => {
	return sequelize.define(`guild${guildID}`, {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		balance: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		sign_time: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		timestamps: false
	});
}