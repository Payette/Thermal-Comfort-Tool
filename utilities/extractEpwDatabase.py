import os
import zipfile

"""Extract the ewp database into its component text files.

Args:
    A directory that contains the compressed epw database in a folder called "compressed."
Returns:
    All of the epw files extracted into a folder called "extracted."
"""

directory  = "d:\ladybug\\epwDatabase\\"
compressDir = directory + "compressed\\"
extractDir = directory + "extracted\\"
if not os.path.isdir(extractDir):
    os.mkdir(extractDir)

def unzip(source_filename, dest_dir):
    with zipfile.ZipFile(source_filename) as zf:
        for member in zf.infolist():
            # Path traversal defense copied from
            # http://hg.python.org/cpython/file/tip/Lib/http/server.py#l789
            words = member.filename.split('\\')
            path = dest_dir
            for word in words[:-1]:
                drive, word = os.path.splitdrive(word)
                head, word = os.path.split(word)
                if word in (os.curdir, os.pardir, ''): continue
                path = os.path.join(path, word)
            zf.extract(member, path)

for folder in os.listdir(compressDir):
    totalDir = compressDir + folder + "\\"
    totalDestinationDir = extractDir + folder + "\\"
    for compFile in os.listdir(totalDir):
        theZipFile = totalDir + compFile
        destination = totalDestinationDir + compFile.split(".zip")[0]
        unzip(theZipFile, destination)
        print "Extracted to " + destination
