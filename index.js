const HTMLParser = require('node-html-parser')
const request = require('request')
const rp = require('request-promise')
const fs = require('fs')
const yargs = require('yargs')

const argv = yargs
.option('new', {
    alias: 'n',
    description: 'New file codes.json',
    type: 'boolean'
})
.help()
.alias('help', 'h')
.argv

let codes = {}
if(argv.new)
{
	fs.unlink('codes.json', () => {})
	fs.writeFileSync('codes.json', '{}')
}
else
	codes = JSON.parse(fs.readFileSync('codes.json'))

let counter = 0, found = 0

let urls = [
	'https://www.24000.ru/i1/',
	'https://www.24000.ru/i1/x4/',
	'https://www.24000.ru/i1/x2/',
	'https://www.24000.ru/i1/x6/',
	'https://www.24000.ru/i1/x5/',
	'https://www.24000.ru/i1/x7/',
	'https://www.24000.ru/i1/x8/',
	'https://www.24000.ru/i1/x3/',
	'https://www.24000.ru/i1/x1/',
	'https://www.24000.ru/i1/x9/',
	'https://www.24000.ru/i1/x4/gde-vzyat-deneg-bez-vozvrata/',
	'https://www.24000.ru/i1/x4/youtube-kanaly-s-rozygryshami-prizov/',
	'https://www.24000.ru/i1/x4/kak-poluchit-posobie-po-bezrabotitse/',
	'https://www.24000.ru/i1/x9/zaliv-deneg-na-kartu/',
	'https://www.24000.ru/i1/x9/podat-zhalobu-na-moshennikov/',
	'https://www.24000.ru/i1/x1/kakie-banki-ne-otkazyvayut-v-kredite/',
	'https://www.24000.ru/i1/x1/prichiny-otkaza-v-kredite/',
	'https://www.24000.ru/i1/x3/chto-vkhodit-v-tsenu-kredita/',
	'https://www.24000.ru/i1/x6/kak-kupit-valyutu-napryamuyu-na-rynke/',
	'https://www.24000.ru/i1/x6/kak-kupit-dollary-v-internete/',
	'https://www.24000.ru/i1/x2/primery-neudachnogo-biznesa/',
	'https://www.24000.ru/i1/x2/kak-zakryt-ip/',
	'https://www.24000.ru/i1/x4/pomosch-dengami-online/',
	'https://www.24000.ru/i1/x4/investitsii-v-indeks-odobreniya-sayta-24000ru/',
	'https://www.24000.ru/i1/x4/programma-dobro-za-dobro/',
	'https://www.24000.ru/i1/x4/razdacha-deneg-besplatno/',
	'https://www.24000.ru/i1/x4/dam-deneg-prosto-tak/',
	'https://www.24000.ru/i1/x4/24000ru-otzyvy-o-sayte/'
]

async function main()
{
	while(true)
	{
		let rnd = +((Math.random()*urls.length-1).toFixed())
		if(rnd < 0) rnd = 0
		let content = await rp(urls[rnd])
		console.log(urls[rnd])

		console.log('> count:'+ ++counter+' found:'+found)
		let doc = HTMLParser.parse(content)
		let text = doc.querySelector('.last').structuredText
		let pos = text.indexOf('№')
		if(pos !== -1)
		{
			found++
			let str = text.substring(pos+1, pos+9)
			let [num, code] = str.split(' ')
			code = code.substring(0, 5)
			if(num > 2 && codes[num] === undefined)
			{
				codes[num] = code
				fs.writeFileSync('codes.json', JSON.stringify(codes, null, 2))
				console.log(codes)
			}
		}
		await new Promise((done, fail) => setTimeout(() => done(), 1000))
	}
}

main()