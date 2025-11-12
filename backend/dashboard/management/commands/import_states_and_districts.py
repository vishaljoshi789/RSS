import json
from django.core.management.base import BaseCommand
from django.db import transaction
from dashboard.models import State, District


class Command(BaseCommand):
    help = "Import all Indian States and Districts from predefined JSON data"

    def handle(self, *args, **kwargs):
        data = {
            "India": {
                "Andhra Pradesh": {
                "districts": {
                    "Visakhapatnam": ["Visakhapatnam", "Bheemunipatnam", "Anakapalle"],
                    "Vijayawada": ["Vijayawada", "Gannavaram", "Jaggayyapeta"],
                    "Krishna": ["Machilipatnam", "Gudivada", "Pedana", "Vijayawada"],
                    "Guntur": ["Guntur", "Tenali", "Mangalagiri"],
                    "Nellore": ["Nellore", "Kavali", "Gudur"],
                    "Kurnool": ["Kurnool", "Adoni", "Nandyal"],
                    "Kakinada": ["Kakinada", "Rajahmundry", "Pithapuram"],
                    "Tirupati": ["Tirupati", "Chandragiri", "Puttur"],
                    "Chittoor": ["Chittoor", "Tirupati", "Madanapalle"],
                    "Anantapur": ["Anantapur", "Hindupur", "Guntakal"]
                }
                },
                "Arunachal Pradesh": {
                "districts": {
                    "Itanagar": ["Itanagar", "Naharlagun"],
                    "Tawang": ["Tawang", "Jang"],
                    "West Siang": ["Along", "Aalo", "Tato"],
                    "Papum Pare": ["Yupia", "Balijan", "Doimukh"],
                    "Changlang": ["Changlang", "Miao", "Jairampur"]
                }
                },
                "Assam": {
                "districts": {
                    "Guwahati": ["Guwahati", "Dispur", "Jalukbari"],
                    "Kamrup": ["Guwahati", "Rangia", "Boko"],
                    "Dibrugarh": ["Dibrugarh", "Naharkatia", "Duliajan"],
                    "Cachar": ["Silchar", "Hailakandi", "Karimganj"],
                    "Silchar": ["Silchar", "Hailakandi", "Karimganj"],
                    "Jorhat": ["Jorhat", "Titabar", "Majuli"],
                    "Nagaon": ["Nagaon", "Hojai", "Lumding"],
                    "Tinsukia": ["Tinsukia", "Digboi", "Margherita"]
                }
                },
                "Bihar": {
                "districts": {
                    "Patna": ["Patna", "Danapur", "Phulwari Sharif"],
                    "Gaya": ["Gaya", "Bodh Gaya", "Tekari"],
                    "Bhagalpur": ["Bhagalpur", "Kahalgaon", "Naugachhia"],
                    "Muzaffarpur": ["Muzaffarpur", "Motipur", "Kanti"],
                    "Darbhanga": ["Darbhanga", "Benipur", "Jale"],
                    "Purnia": ["Purnia", "Kasba", "Banmankhi"],
                    "Begusarai": ["Begusarai", "Bakhri", "Teghra"],
                    "Nalanda": ["Bihar Sharif", "Rajgir", "Hilsa"]
                }
                },
                "Chhattisgarh": {
                "districts": {
                    "Raipur": ["Raipur", "Durg", "Bhilai"],
                    "Bilaspur": ["Bilaspur", "Korba", "Champa"],
                    "Durg": ["Durg", "Rajnandgaon", "Dhamtari"],
                    "Bastar": ["Jagdalpur", "Kondagaon", "Narayanpur"],
                    "Surguja": ["Ambikapur", "Surajpur", "Baikunthpur"]
                }
                },
                "Goa": {
                "districts": {
                    "North Goa": ["Panaji", "Mapusa", "Ponda", "Bicholim"],
                    "South Goa": ["Margao", "Vasco da Gama", "Quepem", "Canacona"]
                }
                },
                "Gujarat": {
                "districts": {
                    "Ahmedabad": ["Ahmedabad", "Gandhinagar", "Sanand"],
                    "Surat": ["Surat", "Bardoli", "Olpad"],
                    "Vadodara": ["Vadodara", "Ankleshwar", "Dabhoi"],
                    "Rajkot": ["Rajkot", "Gondal", "Jetpur"],
                    "Bhavnagar": ["Bhavnagar", "Mahuva", "Sihor"],
                    "Jamnagar": ["Jamnagar", "Dwarka", "Khambhalia"],
                    "Junagadh": ["Junagadh", "Veraval", "Mangrol"],
                    "Gandhinagar": ["Gandhinagar", "Mansa", "Kalol"]
                }
                },
                "Haryana": {
                "districts": {
                    "Gurugram": ["Gurugram", "Gurgaon", "Pataudi", "Sohna"],
                    "Faridabad": ["Faridabad", "Ballabgarh", "Palwal"],
                    "Panipat": ["Panipat", "Samalkha", "Madlauda"],
                    "Ambala": ["Ambala", "Ambala Cantt", "Naraingarh"],
                    "Yamunanagar": ["Yamunanagar", "Jagadhri", "Radaur"],
                    "Rohtak": ["Rohtak", "Meham", "Kalanaur"],
                    "Hisar": ["Hisar", "Hansi", "Barwala"],
                    "Karnal": ["Karnal", "Assandh", "Indri"]
                }
                },
                "Himachal Pradesh": {
                "districts": {
                    "Shimla": ["Shimla", "Solan", "Kasauli"],
                    "Kullu": ["Kullu", "Manali", "Bhuntar"],
                    "Kangra": ["Dharamshala", "Kangra", "Palampur"],
                    "Mandi": ["Mandi", "Sundernagar", "Joginder Nagar"],
                    "Chamba": ["Chamba", "Dalhousie", "Bharmour"],
                    "Una": ["Una", "Amb", "Gagret"],
                    "Bilaspur": ["Bilaspur", "Ghumarwin", "Jhandutta"]
                }
                },
                "Jharkhand": {
                "districts": {
                    "Ranchi": ["Ranchi", "Namkum", "Bundu"],
                    "East Singhbhum": ["Jamshedpur", "Ghatshila", "Musabani", "Chakulia"],
                    "Jamshedpur": ["Jamshedpur", "Adityapur", "Jugsalai"],
                    "Dhanbad": ["Dhanbad", "Jharia", "Sindri"],
                    "Bokaro": ["Bokaro Steel City", "Chas", "Phusro"],
                    "Deoghar": ["Deoghar", "Madhupur", "Sarwan"],
                    "Hazaribagh": ["Hazaribagh", "Chatra", "Barhi"]
                }
                },
                "Karnataka": {
                "districts": {
                    "Bengaluru Urban": [
                    "Bengaluru",
                    "Bangalore",
                    "Yelahanka",
                    "Byatarayanapura"
                    ],
                    "Mysuru": ["Mysuru", "Mysore", "Nanjangud", "K.R. Nagar"],
                    "Dakshina Kannada": ["Mangaluru", "Mangalore", "Bantwal", "Puttur"],
                    "Mangaluru": ["Mangaluru", "Bantwal", "Puttur"],
                    "Hubballi-Dharwad": ["Hubballi", "Dharwad", "Kalghatgi"],
                    "Belagavi": ["Belagavi", "Belgaum", "Gokak", "Chikodi"],
                    "Kalaburagi": ["Kalaburagi", "Afzalpur", "Chincholi"],
                    "Ballari": ["Ballari", "Hospet", "Siruguppa"],
                    "Shivamogga": ["Shivamogga", "Bhadravati", "Sagar"]
                }
                },
                "Kerala": {
                "districts": {
                    "Thiruvananthapuram": [
                    "Thiruvananthapuram",
                    "Neyyattinkara",
                    "Varkala"
                    ],
                    "Ernakulam": ["Kochi", "Aluva", "Muvattupuzha", "Kothamangalam"],
                    "Kochi": ["Kochi", "Aluva", "Kalamassery"],
                    "Kozhikode": ["Kozhikode", "Vadakara", "Koyilandy", "Vatakara"],
                    "Kollam": ["Kollam", "Karunagappally", "Paravur"],
                    "Thrissur": ["Thrissur", "Chalakudy", "Kodungallur"],
                    "Kannur": ["Kannur", "Taliparamba", "Payyanur"],
                    "Alappuzha": ["Alappuzha", "Cherthala", "Kayamkulam"],
                    "Palakkad": ["Palakkad", "Ottapalam", "Chittur"]
                }
                },
                "Madhya Pradesh": {
                "districts": {
                    "Indore": ["Indore", "Mhow", "Sanwer"],
                    "Bhopal": ["Bhopal", "Berasia", "Huzur"],
                    "Jabalpur": ["Jabalpur", "Sihora", "Patan"],
                    "Gwalior": ["Gwalior", "Dabra", "Bhitarwar"],
                    "Ujjain": ["Ujjain", "Nagda", "Mahidpur"],
                    "Sagar": ["Sagar", "Khurai", "Banda"],
                    "Dewas": ["Dewas", "Khategaon", "Bagli"],
                    "Satna": ["Satna", "Maihar", "Nagod"]
                }
                },
                "Maharashtra": {
                "districts": {
                    "Mumbai City": ["Mumbai", "Colaba", "Churchgate"],
                    "Mumbai Suburban": ["Bandra", "Andheri", "Borivali", "Thane"],
                    "Pune": ["Pune", "Pimpri-Chinchwad", "Khadki"],
                    "Nagpur": ["Nagpur", "Kamptee", "Ramtek"],
                    "Nashik": ["Nashik", "Sinnar", "Malegaon"],
                    "Chhatrapati Sambhaji Nagar": ["Aurangabad", "Khuldabad", "Vaijapur"],
                    "Aurangabad": ["Aurangabad", "Khuldabad", "Vaijapur"],
                    "Solapur": ["Solapur", "Pandharpur", "Barshi"],
                    "Kolhapur": ["Kolhapur", "Ichalkaranji", "Kagal"]
                }
                },
                "Manipur": {
                "districts": {
                    "Imphal West": ["Imphal", "Lamphelpat", "Wangoi"],
                    "Imphal East": ["Porompat", "Jiribam", "Andro"],
                    "Churachandpur": ["Churachandpur", "Singhat", "Tuibong"],
                    "Ukhrul": ["Ukhrul", "Phungyar", "Kamjong"],
                    "Thoubal": ["Thoubal", "Lilong", "Kakching"],
                    "Bishnupur": ["Bishnupur", "Moirang", "Nambol"]
                }
                },
                "Meghalaya": {
                "districts": {
                    "East Khasi Hills": ["Shillong", "Sohra", "Mawkyrwat"],
                    "West Jaintia Hills": ["Jowai", "Amlarem", "Nartiang"],
                    "West Garo Hills": ["Tura", "Resubelpara", "Tikrikilla"],
                    "Jaintia Hills": ["Jowai", "Khliehriat", "Amlarem"]
                }
                },
                "Mizoram": {
                "districts": {
                    "Aizawl": ["Aizawl", "Darlawn", "Thingsulthliah"],
                    "Lunglei": ["Lunglei", "Tlabung", "Hnahthial"],
                    "Champhai": ["Champhai", "Khawbung", "Ngopa", "Zokhawthar", "Farkawn"]
                }
                },
                "Nagaland": {
                "districts": {
                    "Dimapur": ["Dimapur", "Chumukedima", "Medziphema"],
                    "Kohima": ["Kohima", "Jakhama", "Tseminyu"],
                    "Mokokchung": ["Mokokchung", "Longsa", "Tuli"],
                    "Mon": ["Mon", "Aboi", "Tizit"]
                }
                },
                "Odisha": {
                "districts": {
                    "Khordha": ["Bhubaneswar", "Jatani", "Balianta"],
                    "Cuttack": ["Cuttack", "Banki", "Athagarh"],
                    "Puri": ["Puri", "Konark", "Pipli", "Pipili"],
                    "Ganjam": ["Berhampur", "Chhatrapur", "Gopalpur"],
                    "Balasore": ["Balasore", "Jaleswar", "Nilagiri"],
                    "Sambalpur": ["Sambalpur", "Burla", "Rairakhol"],
                    "Rourkela": ["Rourkela", "Rajgangpur", "Bonai"]
                }
                },
                "Punjab": {
                "districts": {
                    "Amritsar": ["Amritsar", "Ajnala", "Majitha"],
                    "Ludhiana": ["Ludhiana", "Khanna", "Samrala", "Jagraon"],
                    "Jalandhar": ["Jalandhar", "Nakodar", "Phillaur"],
                    "Patiala": ["Patiala", "Rajpura", "Samana"],
                    "Bathinda": ["Bathinda", "Talwandi Sabo", "Rampura Phul"],
                    "Mohali": ["Mohali", "Kharar", "Kurali"],
                    "Hoshiarpur": ["Hoshiarpur", "Garhshankar", "Dasuya"],
                    "Ferozepur": ["Ferozepur", "Zira", "Fazilka"]
                }
                },
                "Rajasthan": {
                "districts": {
                    "Jaipur": ["Jaipur", "Amber", "Sanganer"],
                    "Jodhpur": ["Jodhpur", "Phalodi", "Bilara"],
                    "Kota": ["Kota", "Ramganj Mandi", "Sangod"],
                    "Bikaner": ["Bikaner", "Nokha", "Kolayat"],
                    "Ajmer": ["Ajmer", "Pushkar", "Kishangarh"],
                    "Udaipur": ["Udaipur", "Nathdwara", "Salumbar"],
                    "Alwar": ["Alwar", "Behror", "Tijara"],
                    "Bharatpur": ["Bharatpur", "Deeg", "Kumher"]
                }
                },
                "Sikkim": {
                "districts": {
                    "Gangtok": ["Gangtok", "Pakyong", "Rongli"],
                    "East Sikkim": ["Gangtok", "Pakyong", "Rongli"],
                    "Namchi": ["Namchi", "Jorethang", "Ravangla"],
                    "South Sikkim": ["Namchi", "Jorethang", "Ravangla"],
                    "Gyalshing": ["Gyalshing", "Pelling", "Soreng"],
                    "West Sikkim": ["Gyalshing", "Pelling", "Soreng"],
                    "Mangan": ["Mangan", "Lachen", "Lachung", "Chungthang"],
                    "North Sikkim": ["Mangan", "Chungthang", "Lachung"]
                }
                },
                "Tamil Nadu": {
                "districts": {
                    "Chennai": ["Chennai", "Mylapore", "Alandur", "Ambattur", "Guindy", "Egmore"],
                    "Coimbatore": ["Coimbatore", "Mettupalayam", "Pollachi", "Valparai"],
                    "Madurai": ["Madurai", "Melur", "Vadipatti"],
                    "Kanchipuram": ["Kanchipuram", "Chengalpattu", "Mahabalipuram"],
                    "Tiruchirappalli": ["Tiruchirappalli", "Srirangam", "Lalgudi"],
                    "Salem": ["Salem", "Mettur", "Attur"],
                    "Tirunelveli": ["Tirunelveli", "Palayamkottai", "Ambasamudram"],
                    "Erode": ["Erode", "Gobichettipalayam", "Bhavani"],
                    "Vellore": ["Vellore", "Katpadi", "Gudiyatham"]
                }
                },
                "Telangana": {
                "districts": {
                    "Hyderabad": ["Hyderabad", "Secunderabad", "Charminar"],
                    "Rangareddy": ["Shamshabad", "Rajendranagar", "Serilingampally"],
                    "Warangal": ["Warangal", "Hanamkonda", "Jangaon"],
                    "Khammam": ["Khammam", "Kothagudem", "Wyra"],
                    "Nizamabad": ["Nizamabad", "Bodhan", "Armoor"],
                    "Karimnagar": ["Karimnagar", "Jagtial", "Peddapalli"]
                }
                },
                "Tripura": {
                "districts": {
                    "West Tripura": ["Agartala", "Mohanpur", "Jirania"],
                    "Dhalai": ["Ambassa", "Kamalpur", "Gandatwisa"],
                    "South Tripura": ["Udaipur", "Belonia", "Sabroom"],
                    "North Tripura": ["Dharmanagar", "Kanchanpur", "Panisagar"]
                }
                },
                "Uttar Pradesh": {
                "districts": {
                    "Lucknow": ["Lucknow", "Malihabad", "Kakori", "Gosainganj", "Mohanlalganj"],
                    "Agra": ["Agra", "Fatehabad", "Kiraoli"],
                    "Varanasi": ["Varanasi", "Chandauli", "Chiraigaon"],
                    "Prayagraj": ["Prayagraj", "Allahabad", "Phulpur", "Handia"],
                    "Kanpur Nagar": ["Kanpur", "Kanpur Dehat", "Akbarpur"],
                    "Kanpur": ["Kanpur", "Kanpur Dehat", "Akbarpur"],
                    "Ghaziabad": ["Ghaziabad", "Modinagar", "Loni"],
                    "Meerut": ["Meerut", "Sardhana", "Mawana"],
                    "Allahabad": ["Prayagraj", "Phulpur", "Soraon"],
                    "Bareilly": ["Bareilly", "Aonla", "Faridpur"],
                    "Aligarh": ["Aligarh", "Khair", "Atrauli"],
                    "Moradabad": ["Moradabad", "Thakurdwara", "Sambhal"],
                    "Saharanpur": ["Saharanpur", "Deoband", "Roorkee"],
                    "Gorakhpur": ["Gorakhpur", "Chauri Chaura", "Gola"]
                }
                },
                "Uttarakhand": {
                "districts": {
                    "Dehradun": ["Dehradun", "Mussoorie", "Rishikesh"],
                    "Haridwar": ["Haridwar", "Roorkee", "Laksar"],
                    "Nainital": ["Nainital", "Haldwani", "Ramnagar"],
                    "Almora": ["Almora", "Ranikhet", "Bageshwar"],
                    "Pauri Garhwal": ["Pauri", "Kotdwar", "Lansdowne"],
                    "Udham Singh Nagar": ["Rudrapur", "Kashipur", "Kichha"]
                }
                },
                "West Bengal": {
                "districts": {
                    "Kolkata": ["Kolkata", "Alipore", "Howrah", "Salt Lake"],
                    "Howrah": ["Howrah", "Uluberia", "Bagnan"],
                    "North 24 Parganas": ["Barasat", "Barrackpur", "Basirhat"],
                    "South 24 Parganas": ["Baruipur", "Diamond Harbour", "Kakdwip"],
                    "Darjeeling": ["Darjeeling", "Siliguri", "Kalimpong"],
                    "Jalpaiguri": ["Jalpaiguri", "Alipurduar", "Malbazar"],
                    "Murshidabad": ["Berhampore", "Kandi", "Jangipur"],
                    "Nadia": ["Krishnanagar", "Ranaghat", "Chakdaha"],
                    "Paschim Bardhaman": ["Bardhaman", "Asansol", "Durgapur"],
                    "Bardhaman": ["Bardhaman", "Asansol", "Durgapur"]
                }
                },
                "Andaman and Nicobar Islands": {
                "districts": {
                    "South Andaman": ["Port Blair", "Wandoor", "Ferrargunj"],
                    "North and Middle Andaman": ["Mayabunder", "Rangat", "Diglipur"],
                    "Nicobar": ["Car Nicobar", "Nancowry", "Campbell Bay"]
                }
                },
                "Chandigarh": {
                "districts": {
                    "Chandigarh": ["Sector 17", "Sector 22", "Manimajra"]
                }
                },
                "Dadra and Nagar Haveli and Daman and Diu": {
                "districts": {
                    "Daman": ["Daman", "Nani Daman", "Moti Daman"],
                    "Diu": ["Diu", "Ghogla", "Fudam"],
                    "Dadra and Nagar Haveli": ["Silvassa", "Naroli", "Rakholi"]
                }
                },
                "Delhi": {
                "districts": {
                    "New Delhi": ["New Delhi", "Connaught Place", "India Gate", "Chanakyapuri"],
                    "South Delhi": ["Hauz Khas", "Greater Kailash", "Vasant Vihar"],
                    "North Delhi": ["Civil Lines", "Model Town", "Sadar Bazaar"],
                    "West Delhi": ["Rajouri Garden", "Janakpuri", "Paschim Vihar"],
                    "East Delhi": ["Preet Vihar", "Mayur Vihar", "Shahdara"],
                    "Central Delhi": ["Karol Bagh", "Paharganj", "Daryaganj"],
                    "North East Delhi": ["Seelampur", "Shahdara", "Nand Nagri"],
                    "North West Delhi": ["Rohini", "Pitampura", "Kanjhawala"],
                    "South West Delhi": ["Dwarka", "Vasant Kunj", "Kapashera"]
                }
                },
                "Jammu and Kashmir": {
                "districts": {
                    "Srinagar": ["Srinagar", "Badgam", "Ganderbal"],
                    "Jammu": ["Jammu", "Akhnoor", "Bishnah"],
                    "Anantnag": ["Anantnag", "Pahalgam", "Kokernag"],
                    "Baramulla": ["Baramulla", "Sopore", "Uri"],
                    "Udhampur": ["Udhampur", "Ramnagar", "Chenani"],
                    "Kathua": ["Kathua", "Hiranagar", "Billawar"]
                }
                },
                "Ladakh": {
                "districts": {
                    "Leh": ["Leh", "Nubra", "Changthang"],
                    "Kargil": ["Kargil", "Zanskar", "Drass"]
                }
                },
                "Lakshadweep": {
                "districts": {
                    "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott"]
                }
                },
                "Puducherry": {
                "districts": {
                    "Puducherry": ["Puducherry", "Ozhukarai", "Oulgaret", "Ariyankuppam", "Villianur"],
                    "Karaikal": ["Karaikal", "Thirunallar", "Neravy"],
                    "Mahe": ["Mahe", "Palloor"],
                    "Yanam": ["Yanam", "Agraharam"]
                }
                }
            }
        }

        india_data = data.get("India", {})
        total_states = len(india_data)
        created_states = 0
        created_districts = 0

        with transaction.atomic():
            for state_name, state_info in india_data.items():
                state_obj, state_created = State.objects.get_or_create(name=state_name.strip())
                if state_created:
                    created_states += 1

                districts = state_info.get("districts", {})
                for district_name in districts.keys():
                    district_obj, district_created = District.objects.get_or_create(
                        name=district_name.strip(),
                        state=state_obj
                    )
                    if district_created:
                        created_districts += 1

        self.stdout.write(self.style.SUCCESS(
            f"✅ Import completed successfully!\n"
            f"Total States Processed: {total_states}\n"
            f"New States Created: {created_states}\n"
            f"New Districts Created: {created_districts}"
        ))
