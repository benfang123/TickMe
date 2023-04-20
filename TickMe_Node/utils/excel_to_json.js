const xlsx = require('node-xlsx');
const echartsType = {
	hotproduct: (workSheetsFromFile) => {
		const data = [];
		const sheet1 = workSheetsFromFile[0].data;
		for (let i = 1; i < sheet1.length; i++) {
			const item = {};
			item.name = sheet1[i][0];
			item.children = [];

			// 按照子类别分组
			const groupBySubcategory = {};
			for (let j = 1; j < sheet1[i].length; j++) {
				const subcategory = sheet1[i][j][0];
				const subcategoryValue = sheet1[i][j][1];
				const itemName = sheet1[i][j][2];
				const itemValue = sheet1[i][j][3];

				if (!groupBySubcategory[subcategory]) {
					groupBySubcategory[subcategory] = {
						name: subcategory,
						value: subcategoryValue,
						children: []
					};
				}

				groupBySubcategory[subcategory].children.push({
					name: itemName,
					value: itemValue
				});
			}

			// 将分组后的数据加入到item.children中
			for (const key in groupBySubcategory) {
				item.children.push(groupBySubcategory[key]);
			}

			data.push(item);
		}
		return data
	},
	maps: (workSheetsFromFile) => {
		// 选择第一个工作表
		const sheet1 = workSheetsFromFile[0];
		
		// 将数据转换为适合可视化库使用的格式
		const result = [];
		const categories = {};
		for (let i = 1; i < sheet1.data.length; i++) {
		  const row = sheet1.data[i];
		  const categoryName = row[0];
		  const subcategoryName = row[1];
		  const longitude = row[2];
		  const latitude = row[3];
		
		  if (!categories[categoryName]) {
		    categories[categoryName] = {
		      name: categoryName,
		      children: []
		    };
		    result.push(categories[categoryName]);
		  }
		
		  categories[categoryName].children.push({
		    name: subcategoryName,
		    value: [longitude, latitude]
		  });
		}
		return result

	},
	rankAndSeller:(workSheetsFromFile)=>{	
		// 选择第一个工作表
		const sheet1 = workSheetsFromFile[0];
		// 将数据转换为适合您的 JSON 数据格式
		const result = [];
		for (let i = 1; i < sheet1.data.length; i++) {
		  const row = sheet1.data[i];
		  const name = row[0];
		  const value = row[1];
		  result.push({name: name, value: value});
		}
		return result
	},
	stock:(workSheetsFromFile)=>{
		const sheet1 = workSheetsFromFile[0];
		// 将数据转换为适合您的 JSON 数据格式
		const result = [];
		for (let i = 1; i < sheet1.data.length; i++) {
		  const row = sheet1.data[i];
		  const name = row[0];
		  const stock = row[1];
		  const sales = row[2];
		  result.push({name: name, stock: stock, sales: sales});
		}
		return result
	}
		

}

function readExcelFile(buffer,index) {
	// 读取Excel文件
	const workSheetsFromFile = xlsx.parse(buffer);
	let data;
	let type;
	switch (parseInt(index)){
		case 0:
			type="trend"
			// const data = echartsType.hotproduct(workSheetsFromFile)
			console.log("暂时不允许使用excel上传折叠面积图数据")
			break;
		case 1:
			type="seller"
			data=echartsType.rankAndSeller(workSheetsFromFile)
			break;
		case 2:
			type="map"
			data=echartsType.maps(workSheetsFromFile)
			break;
		case 3:
			type="rank"
			data=echartsType.rankAndSeller(workSheetsFromFile)
			break;
		case 4:
			type="hot"
			data = echartsType.hotproduct(workSheetsFromFile)
			break;
		case 5:
			type="stock"
			data=echartsType.stock(workSheetsFromFile)
			break;
		default:
			break;
	}
	const jsonData=JSON.stringify(data)
	return {type:type,jsonData:jsonData}
}



module.exports = {
	readExcelFile: readExcelFile
};
