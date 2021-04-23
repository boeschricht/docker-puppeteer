var alasql = require(`alasql`)


    values= [
        {
            'URL ID': 'XCSE05NYK01EA53',
            'URL beskrivelse': 'Nasdaq Nykredit 0,5%',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE05NYK01EA53',
            'Dato': '20210423',
            'Tid': '00:33',
            'Kurs': '95,4'
        },
        {
            'URL ID': 'XCSE05NYK01EA53',
            'URL beskrivelse': 'Nasdaq Nykredit 0,5%',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE05NYK01EA53',
            'Dato': '20210423',
            'Tid': '00:57',
            'Kurs': '95,7'
        },
        {
            'URL ID': 'XCSE05NYK01EA53',
            'URL beskrivelse': 'Nasdaq Nykredit 0,5%',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE05NYK01EA53',
            'Dato': '20210423',
            'Tid': '02:33',
            'Kurs': '98,5'
        },
        {
            'URL ID': 'XCSE1NYK01EA53',
            'URL beskrivelse': 'Nasdaq Nykredit 1% obligationslån 30 årig fast rente',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE1NYK01EA53',
            'Dato': '20210420',
            'Tid': '07:33',
            'Kurs': '92,1'
        },
        {
            'URL ID': 'XCSE1NYK01EA53',
            'URL beskrivelse': 'Nasdaq Nykredit 1% obligationslån 30 årig fast rente',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE1NYK01EA53',
            'Dato': '20210421',
            'Tid': '10:33',
            'Kurs': '92,5'
        },
        {
            'URL ID': 'XCSE1NYK01EA53',
            'URL beskrivelse': 'Nasdaq Nykredit 1% obligationslån 30 årig fast rente',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE1NYK01EA53',
            'Dato': '20210422',
            'Tid': '08:33',
            'Kurs': '92,9'
        },
        {
            'URL ID': 'XCSE15NYK01EDA53',
            'URL beskrivelse': 'Nasdaq Nykredit 1,5% obligationslån 30 årig fast rente',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE15NYK01EDA53',
            'Dato': '20210419',
            'Tid': '12:32',
            'Kurs': '98,1'
        },
        {
            'URL ID': 'XCSE15NYK01EDA53',
            'URL beskrivelse': 'Nasdaq Nykredit 1,5% obligationslån 30 årig fast rente',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE15NYK01EDA53',
            'Dato': '20210420',
            'Tid': '20:29',
            'Kurs': '98,4'
        },
        {
            'URL ID': 'XCSE15NYK01EDA53',
            'URL beskrivelse': 'Nasdaq Nykredit 1,5% obligationslån 30 årig fast rente',
            'URL adresse': 'http://www.nasdaqomxnordic.com/bonds/denmark/microsite?Instrument=XCSE15NYK01EDA53',
            'Dato': '20210421',
            'Tid': '22:32',
            'Kurs': '98,9'
        }
    ]

    alasql("CREATE TABLE dataset (`URL ID` string, `URL beskrivelse` string, `URL adresse` string, `Dato` date, `Tid` time, `Kurs` number, `Fejl` string)");
    alasql("INSERT INTO dataset SELECT * FROM ?", [values])
    var res = alasql("Select * FROM dataset")
    console.info(res)
    