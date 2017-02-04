import os

directory  = "E:\epwDatabase\\"
heatingDDYFileName = "Heatingddy.json"
ddyjson = directory + "refined\\" + heatingDDYFileName

fd = open(ddyjson,'r')
fdstr = fd.read()
pythonDictionary = eval(fdstr)
print pythonDictionary.keys()

fd.close()
