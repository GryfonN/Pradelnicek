#!/bin/sh

# because sh or ./ do not support substrings
echo
echo "RUN AS: 'bash clothes-grabber.sh'"
echo

# initialize a local var
imgsDir="app/img/clothes_photos"
jsonFile="app/data/clothes/clothes.json"

# check if file exists. this is not required as echo >> would
# would create it any way. but for this example I've added it for you
# -f checks if a file exists. The ! operator negates the result
if [ ! -f "$jsonFile" ] ; then
    # if not create the file
    touch "$jsonFile"
    echo "JSON file created"
#else
    # if is remove it
#    rm "$jsonFile"
#    touch "$jsonFile"
#    echo "JSON file re-created"
fi

# Override content of file - CLEAR
echo "[" > "$jsonFile"

count=0
for f in "$imgsDir"/*; do
    # if object do not write comma
    if [ ! "$count" -eq 0 ] ; then
        echo "," >> "$jsonFile"
    fi

    # echo -e enable backslash escapes
    # echo -n do not append a newline
    # start of object
    echo "    {" >> "$jsonFile"

    # substring id app/img/clothes_photos/20140715_204004.jpg
    imgName=${f:23}
    echo -e "        \"id\": \"$imgName\"," >> "$jsonFile"

    # substring imgUrl
    imgUrl=${f:4}
    echo "        \"imgUrl\": \"$imgUrl\"" >> "$jsonFile"

    # end of object
    echo -en "    }" >> "$jsonFile"
    count+=1
done

# last char, w/o new line
echo -en '\n]' >> "$jsonFile"


