const Sequelize = require('sequelize');
const fs = require('fs');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

class system {
    constructor(guildID) {
        this.user = require('./user.js')(sequelize, Sequelize.DataTypes, guildID);
        this.initBalance = 1000;
        this.perSign = 100;
        this.signDuration = 1;
        this.user.sync();
    }
    async addUser(userID) {
        await this.user.create({
            user_id: userID,
            balance: this.initBalance,
            sign_time: Date.now()
        });
    }
    async updateSignTime(userID) {
        await this.user.update({ sign_time: Date.now() }, { where: { user_id: userID } });
    }
    async updateBalance(userID, num) {
        const target = await this.user.findOne({ where: { user_id: userID } });
        await this.user.update({ balance: num }, { where: { user_id: userID } });
    }
    async isUserExist(userID) {
        const user = await this.user.findOne({ where: { user_id: userID } });
        return user ? true : false;
    }
    async getUserStats(userID) {
        const user = await this.user.findOne({ where: { user_id: userID } });
        return user;
    }
}

module.exports.system = system;