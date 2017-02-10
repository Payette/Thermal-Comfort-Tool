import os

"""Parse the heating design temperature out of all epw files.

Args:
    directory : A directory that contains the extracted epw database.
    heatingDDYFileName: A json file name into which all heating design temperatures will be written.
Returns:
    A json file name into which all heating design temperatures
"""

directory  = "E:\epwDatabase\\"
heatingDDYFileName = "Heatingddy1.json"

extractDir = directory + "extracted\\"
ddyjson = directory + "refined\\" + heatingDDYFileName


fd = open(ddyjson,'w')
fd.write("{\n")
fd.close()


fd = open(ddyjson,'a')
for folder in os.listdir(extractDir):
    continentTrigger = True
    continentStr = '"' + folder + '"'
    fd.write(continentStr + ":{")
    totalDir = extractDir + folder + "\\"
    allNations = os.listdir(totalDir)
    allNations.sort()

    nationList = []
    privonceList = ['None']
    cityList = []
    for location in allNations:
        # pull the information out of the ddy file
        try:
            ddyFile = totalDir + location + "\\" + location + ".ddy"
            ddy = open(ddyFile, 'r')
            locList = location.split("_")
            nation = locList[0]
            city = " ".join(locList[-2].split('.')[:-1])

            if len(locList) > 3:
                province = locList[1]
            elif nation == "AUS":
                province = city.split(' ')[0]
                city = " ".join(city.split(' ')[1:])
            elif nation == "CHN":
                province = city.split(' ')[0].upper()
                city = " ".join(city.split(' ')[1:])
            else:
                province = 'None'

            for line in ddy:
                if "Annual Heating 99%," in line:
                    designTemp = line.split('=')[-1]
                    designTemp = designTemp[:-3]
            ddy.close()

            # Format variables to be written into a dictionary.
            nation = '"' + nation + '"'
            province = '"' + province + '"'
            city = '"' + city + '"'

            # Write the information into the json.
            if nation not in nationList:
                if continentTrigger == True:
                    continentTrigger = False
                else:
                    fd.write("}")
                    fd.write(",")
                fd.write(nation + " : {")
                fd.write(province + " : {")
                fd.write(city + ": " + designTemp)
                nationList.append(nation)
                privonceList.append(province)
                cityList.append(city)
            elif province not in privonceList:
                fd.write("},")
                fd.write(province + " : {")
                fd.write(city + ": " + designTemp)
                privonceList.append(province)
                cityList.append(city)
            elif city not in cityList:
                fd.write("," + city + ": " + designTemp)
                cityList.append(city)

            print nation + " " + province + " " + city + " - " + designTemp
        except:
            pass

    fd.write("}")
    fd.write("}")
    fd.write("},")
fd.write("}")
fd.close()
