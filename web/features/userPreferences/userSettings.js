define([

], function () {

    var userSettings = {
        panes: {
            name: {
                enabled: 1,
                options: {
                    nameFormat: 1
                }
            },
            font: {
                enabled: 1,
                options: {
                    family: 1,
                    size: 1,
                    weight: 1,
                    color: 1,
                    style: 1
                }
            },
            theme: {
                enabled: 1,
                options: {
                    themeColor: 1
                }
            },
            language: {
                 enabled: 1
            },
            layout: {
                enabled: 1,
                options: {
                    tab: 1,
                    toolbar: 1
                }
            },
            toolbar: {
                enabled: 1 
            },
            tab: {
                enabled: 1 
            },
            mode: {
                enabled: 1
            },
            reset: {
                enabled: 1
            },
            resetToDefaults: {
                enabled: 1
            },
            instantApply: {
                enabled: 1
            }
        },

        systemFonts: [
            { label: 'Aharoni', value: 'Aharoni'},
            { label: 'Andalus Regular', value: 'Andalus Regular'},
            { label: 'Angsana New', value: 'Angsana New'},
            { label: 'AngsanaUPC', value: 'AngsanaUPC'},
            { label: 'Aparajita', value: 'Aparajita'},
            { label: 'Arial', value: 'Arial'},
            { label: 'Batang', value: 'Batang'},
            { label: 'BatangChe', value: 'BatangChe'},
            { label: 'Browallia New', value: 'Browallia New'},
            { label: 'BrowalliaUPC', value: 'BrowalliaUPC'},
            { label: 'Calibri', value: 'Calibri'},
            { label: 'Cambria', value: 'Cambria'},
            { label: 'Cambria Math', value: 'Cambria Math'},
            { label: 'Candara', value: 'Candara'},
            { label: 'Comic Sans MS', value: 'Comic Sans MS'},
            { label: 'Consolas', value: 'Consolas'},
            { label: 'Constantia', value: 'Constantia'},
            { label: 'Corbel', value: 'Corbel'},
            { label: 'Cordia New', value: 'Cordia New'},
            { label: 'CordiaUPC', value: 'CordiaUPC'},
            { label: 'Courier New', value: 'Courier New'},
            { label: 'DaunPenh', value: 'DaunPenh'},
            { label: 'David ', value: 'David '},
            { label: 'DFKai-SB', value: 'DFKai-SB'},
            { label: 'DilleniaUPC', value: 'DilleniaUPC'},
            { label: 'DokChampa', value: 'DokChampa'},
            { label: 'Dotum', value: 'Dotum'},
            { label: 'DotumChe', value: 'DotumChe'},
            { label: 'Ebrima', value: 'Ebrima'},
            { label: 'Estrangelo Edessa', value: 'Estrangelo Edessa'},
            { label: 'EucrosiaUPC', value: 'EucrosiaUPC'},
            { label: 'Euphemia', value: 'Euphemia'},
            { label: 'FangSong', value: 'FangSong'},
            { label: 'Franklin Gothic Medium', value: 'Franklin Gothic Medium'},
            { label: 'Franklin Gothic Medium Italic', value: 'Franklin Gothic Medium Italic'},
            { label: 'FrankRuehl', value: 'FrankRuehl'},
            { label: 'FreesiaUPC', value: 'FreesiaUPC'},
            { label: 'Gabriola', value: 'Gabriola'},
            { label: 'Gautami', value: 'Gautami'},
            { label: 'Georgia', value: 'Georgia'},
            { label: 'Gisha', value: 'Gisha'},
            { label: 'Gulim', value: 'Gulim'},
            { label: 'GulimChe', value: 'GulimChe'},
            { label: 'Gungsuh', value: 'Gungsuh'},
            { label: 'GungsuhChe', value: 'GungsuhChe'},
            { label: 'Impact', value: 'Impact'},
            { label: 'IrisUPC', value: 'IrisUPC'},
            { label: 'Iskoola Pota', value: 'Iskoola Pota'},
            { label: 'JasmineUPC', value: 'JasmineUPC'},
            { label: 'KaiTi', value: 'KaiTi'},
            { label: 'Kalinga', value: 'Kalinga'},
            { label: 'Kartika', value: 'Kartika'},
            { label: 'Khmer UI', value: 'Khmer UI'},
            { label: 'KodchiangUPC', value: 'KodchiangUPC'},
            { label: 'Kokila', value: 'Kokila'},
            { label: 'Lao UI', value: 'Lao UI'},
            { label: 'Latha', value: 'Latha'},
            { label: 'Leelawadee', value: 'Leelawadee'},
            { label: 'Levenim MT', value: 'Levenim MT'},
            { label: 'LilyUPC', value: 'LilyUPC'},
            { label: 'Lucida Console', value: 'Lucida Console'},
            { label: 'Lucida Sans Unicode', value: 'Lucida Sans Unicode'},
            { label: 'Malgun Gothic', value: 'Malgun Gothic'},
            { label: 'Mangal', value: 'Mangal'},
            { label: 'Meiryo', value: 'Meiryo'},
            { label: 'Meiryo UI', value: 'Meiryo UI'},
            { label: 'Microsoft Himalaya', value: 'Microsoft Himalaya'},
            { label: 'Microsoft JhengHei', value: 'Microsoft JhengHei'},
            { label: 'Microsoft New Tai Lue', value: 'Microsoft New Tai Lue'},
            { label: 'Microsoft PhagsPa', value: 'Microsoft PhagsPa'},
            { label: 'Microsoft Sans Serif', value: 'Microsoft Sans Serif'},
            { label: 'Microsoft Tai Le', value: 'Microsoft Tai Le'},
            { label: 'Microsoft Uighur', value: 'Microsoft Uighur'},
            { label: 'Microsoft YaHei', value: 'Microsoft YaHei'},
            { label: 'Microsoft Yi Baiti', value: 'Microsoft Yi Baiti'},
            { label: 'MingLiU', value: 'MingLiU'},
            { label: 'MingLiU_HKSCS', value: 'MingLiU_HKSCS'},
            { label: 'MingLiU_HKSCS-ExtB', value: 'MingLiU_HKSCS-ExtB'},
            { label: 'MingLiU-ExtB', value: 'MingLiU-ExtB'},
            { label: 'Miriam', value: 'Miriam'},
            { label: 'Miriam Fixed', value: 'Miriam Fixed'},
            { label: 'Mongolian Baiti', value: 'Mongolian Baiti'},
            { label: 'MoolBoran', value: 'MoolBoran'},
            { label: 'MS Gothic', value: 'MS Gothic'},
            { label: 'MS Mincho', value: 'MS Mincho'},
            { label: 'MS PGothic', value: 'MS PGothic'},
            { label: 'MS PMincho', value: 'MS PMincho'},
            { label: 'MS UI Gothic', value: 'MS UI Gothic'},
            { label: 'MV Boli', value: 'MV Boli'},
            { label: 'Narkisim', value: 'Narkisim'},
            { label: 'NSimSun', value: 'NSimSun'},
            { label: 'Nyala', value: 'Nyala'},
            { label: 'Palatino Linotype', value: 'Palatino Linotype'},
            { label: 'Plantagenet Cherokee', value: 'Plantagenet Cherokee'},
            { label: 'PMingLiU', value: 'PMingLiU'},
            { label: 'PMingLiU-ExtB', value: 'PMingLiU-ExtB'},
            { label: 'Raavi', value: 'Raavi'},
            { label: 'Rod', value: 'Rod'},
            { label: 'Sakkal Majalla', value: 'Sakkal Majalla'},
            { label: 'Segoe Print', value: 'Segoe Print'},
            { label: 'Segoe Script', value: 'Segoe Script'},
            { label: 'Segoe UI', value: 'Segoe UI'},
            { label: 'Segoe UI Italic', value: 'Segoe UI Italic'},
            { label: 'Segoe UI Light', value: 'Segoe UI Light'},
            { label: 'Segoe UI Symbol', value: 'Segoe UI Symbol'},
            { label: 'Shonar Bangla', value: 'Shonar Bangla'},
            { label: 'Shruti ', value: 'Shruti '},
            { label: 'SimHei', value: 'SimHei'},
            { label: 'Simplified Arabic', value: 'Simplified Arabic'},
            { label: 'SimSun', value: 'SimSun'},
            { label: 'SimSun-ExtB', value: 'SimSun-ExtB'},
            { label: 'Sylfaen', value: 'Sylfaen'},
            { label: 'Symbol', value: 'Symbol'},
            { label: 'Tahoma', value: 'Tahoma'},
            { label: 'Times New Roman', value: 'Times New Roman'},
            { label: 'Traditional Arabic', value: 'Traditional Arabic'},
            { label: 'Trebuchet MS', value: 'Trebuchet MS'},
            { label: 'Tunga', value: 'Tunga'},
            { label: 'Utsaah', value: 'Utsaah'},
            { label: 'Vani', value: 'Vani'},
            { label: 'Verdana', value: 'Verdana'},
            { label: 'Vijaya', value: 'Vijaya'},
            { label: 'Vrinda', value: 'Vrinda'},
            { label: 'Webdings', value: 'Webdings'},
            { label: 'Wingdings', value: 'Wingdings'}
        ],

        systemFontSizes: [
            { label: '10pt', value: '10' },
            { label: '12pt', value: '12' },
            { label: '14pt', value: '14' },
            { label: '16pt', value: '16' },
            { label: '18pt', value: '18' },
            { label: '20pt', value: '20' },
            { label: '22pt', value: '22' },
            { label: '24pt', value: '24' },
            { label: '26pt', value: '26' },
            { label: '28pt', value: '28', disabled: true }
        ],

        nameFormats: [
            { label: 'Lastname, Firstname', value: 'L, F' },
            { label: 'Firstname', value: 'F' },
            { label: 'Lastname', value: 'L', disabled: true },
            { label: 'Firstname Middle. Lastname', value: 'F M. L' }
        ],

        languages: [
            { label: 'English', value: 'en' },
            { label: 'Chinese', value: 'zn-ch' },
            { label: 'Spanish', value: 'es' },
            { label: 'Hindi', value: 'hi' },
            { label: 'Arabic', value: 'ar' },
            { label: 'Portugese', value: 'pt' },
            { label: 'Bangla', value: 'bn' },
            { label: 'Russian', value: 'ru' },
            { label: 'Japanese', value: 'ja' },
            { label: 'Panjabi', value: 'pa' },
            { label: 'Javanese', value: 'jv' },
            { label: 'German', value: 'de' },
            { label: 'Korean', value: 'ko' },
            { label: 'French', value: 'fr' },
            { label: 'Telugu', value: 'te' },
            { label: 'Marathi', value: 'mr' },
            { label: 'Turkish', value: 'tr' },
            { label: 'Tamil', value: 'ta' },
            { label: 'Vietnamese', value: 'vi' },
            { label: 'Urdu', value: 'ur' }
        ],

        themes: [
            { label: 'Sky Blue', value: 'default', themecolor: '#004488', description: 'Sky blue theme',
                layout: {
                    tab: 1,
                    toolbar: 1
                },
                toolbar: 'left',
                tab: 'default',
                mode: 'town',
                font: {
                    family: 'Arial',
                    size: '10',
                    weight: false,
                    style: false,
                    color: '#000000' 
                }
            },
            { label: 'Steadfast', value: 'steadfast', themecolor: '#005577', description: 'Gray scaled theme',
                layout: {
                    tab: 0,
                    toolbar: 1
                },
                toolbar: 'top',
                tab: 'flat',
                mode: 'city',
                font: {
                    family: 'Verdana',
                    size: '10',
                    weight: true,
                    style: false,
                    color: '#000000' 
                }
            },
            { label: 'Space Dark', value: 'spacedark', themecolor: '#000000', description: 'Night theme' ,
                layout: {
                    tab: 1,
                    toolbar: 1
                },
                toolbar: 'right',
                tab: 'float',
                mode: 'country',
                font: {
                    family: 'Times New Roman',
                    size: '12',
                    weight: false,
                    style: false,
                    color: '#000000' 
                }
            },
            { label: 'Bloody Mary', value: 'bloodymary', themecolor: '#770000', description: 'Dark red flat theme' ,
                layout: {
                    tab: 1,
                    toolbar: 1
                },
                toolbar: 'bottom',
                tab: 'default',
                mode: 'town',
                font: {
                    family: 'Georgia',
                    size: '10',
                    weight: false,
                    style: true,
                    color: '#000000' 
                }
            },
            { label: 'Serene Meadow', value: 'serenemeadow', themecolor: '#003300', description: 'Dark green theme' ,
                layout: {
                    tab: 1,
                    toolbar: 0
                },
                toolbar: 'right',
                tab: 'flat',
                mode: 'city',
                font: {
                    family: 'Tahoma',
                    size: '10',
                    weight: false,
                    style: true,
                    color: '#000000' 
                }
            }
        ],
        
        toolbar: [
            { label: 'Top', value: 'top' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
            { label: 'Bottom', value: 'bottom' },
        ],

        tab: [
            { label: 'Smooth', value: 'default' },
            { label: 'Flat', value: 'flat' },
            { label: 'Float', value: 'float' }
        ],

        mode: [
            { label: 'City', value: 'city' },
            { label: 'Town', value: 'town' },
            { label: 'Country', value: 'country' }
        ]
    };

    if (window.CONFIG.debug) {
        window.userSettings = userSettings;
    }

    return userSettings;
});


