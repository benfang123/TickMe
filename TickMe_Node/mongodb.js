const mongoose = require('mongoose');
// 数据模型
const userSchema = new mongoose.Schema({ //用户数据模型
	name: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true // email字段必须唯一
	},
	imageUrl: {
		type: String,
	},
	phone: {
		type: String
	},
	screenName: {
		type: String
	} //网名

})
const chattingRecordSchema = new mongoose.Schema({ //聊天记录数据模型
	data: {
		type: Array,
		required: true,
		// unique: true
	}
})
// echarts图表数据模型
const echartsGraphDataSchema = new mongoose.Schema({
	trend: {
		type: String
	},
	seller: {
		type: String
	},
	map: {
		type: String
	},
	rank: {
		type: String
	},
	hot: {
		type: String
	},
	stock: {
		type: String
	},
})
// 访问模型
const User = mongoose.model('User', userSchema)
const ChattingRecord = mongoose.model("ChattingRecord", chattingRecordSchema)
const EchartsGraphData = mongoose.model("EchartsGraphData", echartsGraphDataSchema)

// 连接数据库
function connect() {
	const monconn = mongoose.connect('mongodb://localhost:27017/benfang', {
		useNewUrlParser: true
	});
	if (monconn) {
		console.log("mongodb连接成功")
	}
}

// 关闭数据库
function close() {
	return mongoose.connection.close();
}

// 登录函数
function islogin(name, password) {
	return User.find()
		.then(users => {
			for (const user of users) {
				if (name === user.name && password === user.password) {
					return {
						name: user.name,
						password: user.password,
						email: user.email,
						imageUrl: user.imageUrl,
						phone: user.phone,
						screenName: user.screenName,
						responseCode: 1,
						message: '登录成功'
					};
				}
			}
			return {
				responseCode: 0,
				message: '账户或密码错误'
			}; // 没有找到匹配的用户
		})
		.catch(error => {
			return {
				responseCode: 0,
				message: error
			};
		});
}
// 注册函数
async function register(name, password, email) {
	try {
		const addUser = new User({
			name: name,
			password: password,
			email: email
		});
		await addUser.save();
		return {
			responseCode: 1,
			message: '注册成功'
		};
	} catch (error) {
		console.log(error);
		return {
			responseCode: 0,
			message: error
		};
	}
}
//修改密码
async function resetPassword(name, password) {
	let result;
	try {
		const user = await User.findOne({
			name: name
		}).exec();
		if (!user) {
			result = {
				responseCode: 0,
				msg: '没有这个账号'
			};
		} else {
			user.password = password;
			const updatedUser = await user.save();
			result = {
				responseCode: 1,
				msg: 'Password updated successfully.'
			};
		}
	} catch (error) {
		result = {
			responseCode: 0,
			msg: error
		};
	}
	return result;
}
// 添加一条内容 参数是 条件名称，条件值，更新名称，更新值，模型名称
async function addField(conditionName, conditionValue, upDataName, upDataValue, accessModel) {
	try {
		const updatedDocument = await accessModel.findOneAndUpdate(
			// 查询条件
			{
				[conditionName]: conditionValue
			},
			// 更新内容
			{
				$set: {
					[upDataName]: upDataValue
				}
			},
			// 选项：返回更新后的文档
			{
				new: true
			}
		);
		console.log(updatedDocument);
	} catch (err) {
		console.error(err);
	}
}

// 查询一条内容  筛选的名称 筛选的值 要查找哪个记录的键 模型名称
async function findPieceContent(conditionName, conditionValue, findName, accessModel) {
	try {
		const user = await accessModel.findOne({
			conditionName: conditionValue
		}, findName);
		return {
			findName: user[findName]
		};
	} catch (err) {
		console.error(err);
		return;
	}
}

async function findPieceContent2(conditionName, conditionValue, findName, accessModel) {
	try {
		const user = await accessModel.findOne({
			[conditionName]: conditionValue
		}, findName);
		return {
			[findName]: user[findName]
		};
	} catch (err) {
		console.error(err);
		return;
	}
}

// 查询一个表中的所有的某个字段;
async function queryAllTheFields(findName, accessModel) {
	try {
		const data = await ChattingRecord.find({}, findName).exec();
		console.log(data);
		return data;
	} catch (e) {
		//TODO handle the exception
		console.log(e);
	}
}
// 按照条件删除指定字段 
/**conditionName：要筛选的字段名。
conditionValue：筛选字段的值。
deleteName：要删除的字段名。
accessModel：要删除字段的模型。*/
async function deleteDataConditionally(conditionName, conditionValue, deleteNames, accessModel) {
  try {
    const query = {};
    query[conditionName] = conditionValue;
    const update = { $unset: {} };
    deleteNames.forEach((name) => {
      update.$unset[name] = '';
    });
    const result = await accessModel.updateMany(query, update);
    console.log(`Deleted fields ${Object.keys(update.$unset).join(', ')} in ${result.nModified} documents.`);
    return result.nModified;
  } catch (error) {
    console.error(`Error deleting fields ${deleteNames.join(', ')}:`, error);
    throw error;
  }
}

// resetPassword('fuqiang', '123456')
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// islogin('benfang', '123456')
//   .then(result => {
//     console.log(result);  // 输出true或false
//   })
//   .catch(error => {
//     console.error(error);
//   });


// 调用该函数
module.exports = {
	connect,
	close,
	islogin,
	register,
	resetPassword,
	addField,
	findPieceContent,
	findPieceContent2,
	queryAllTheFields,
	User,
	ChattingRecord,
	EchartsGraphData,
	deleteDataConditionally
}
