# import the necessary packages
from skimage.segmentation import clear_border
from imutils import contours
from PIL import Image
import numpy as np
import pytesseract
import argparse
import imutils
import cv2
import os

# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-r", "--reference", required=True,
	help="path to reference MICR E-13B font")
args = vars(ap.parse_args())

rectKernel = cv2.getStructuringElement(cv2.MORPH_RECT, (20, 7))
# and threshold it, such that the digits appear as *white* on a
# *black* background
ref = cv2.imread(args["reference"])
height, width = ref.shape[:2]
ref = cv2.resize(ref, (width*2, height*2), interpolation = cv2.INTER_CUBIC)
ref = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY)
ref = imutils.resize(ref, width=400)
#ref = cv2.blur(ref,(10,10))
#ref = cv2.medianBlur(ref,5)
#ref = cv2.bilateralFilter(ref,9,75,75)
#ref = cv2.GaussianBlur(ref,(9,9),100)
ref = cv2.threshold(ref, 0, 255, cv2.THRESH_BINARY_INV |
	cv2.THRESH_OTSU)[1]
ref = clear_border(ref)
# find contours in the MICR image (i.e,. the outlines of the
# characters) and sort them from left to right
refCnts = cv2.findContours(ref.copy(), cv2.RETR_EXTERNAL,
	cv2.CHAIN_APPROX_SIMPLE)
refCnts = refCnts[0] if imutils.is_cv2() else refCnts[1]
refCnts = contours.sort_contours(refCnts, method="left-to-right")[0]
clone = np.dstack([ref.copy()] * 3)

sum_w = 0
sum_h = 0
ano_h = 0

gradX = cv2.Sobel(ref, ddepth=cv2.CV_32F, dx=1, dy=0,
	ksize=-1)
gradX = np.absolute(gradX)
(minVal, maxVal) = (np.min(gradX), np.max(gradX))
gradX = (255 * ((gradX - minVal) / (maxVal - minVal)))
gradX = gradX.astype("uint8")

gradX = cv2.morphologyEx(gradX, cv2.MORPH_CLOSE, rectKernel)
thresh = cv2.threshold(gradX, 0, 255,
	cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
#cv2.imshow("lol", thresh) 

groupCnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
	cv2.CHAIN_APPROX_SIMPLE)
groupCnts = groupCnts[0] if imutils.is_cv2() else groupCnts[1]
groupCnts = contours.sort_contours(groupCnts, method="top-to-bottom")[0]

for c in groupCnts:
	# compute the bounding box of the contour and draw it on our
	# image
	(x, y, w, h) = cv2.boundingRect(c)
	ano_h = ano_h + h
for d in groupCnts:
	(x, y, w, h) = cv2.boundingRect(d)
	if(h < (ano_h)/len(groupCnts)):
		continue
	else:	
		#cv2.rectangle(clone, (x, y), (x + w, y + h), (0, 255, 0), 2)
		#group = clone[y - 2:y + h + 2, x - 2:x + w + 2]
	 	group = ref[y :y + h , x :x + w]
		#cv2.imshow("shit", group)
		#cv2.waitKey(0)
		height, width = group.shape[:2]
		group = cv2.resize(group, (width*3, height*3), interpolation = cv2.INTER_CUBIC)

		# find contours in the MICR image (i.e,. the outlines of the
		# characters) and sort them from left to right
		anoCnts = cv2.findContours(group.copy(), cv2.RETR_EXTERNAL,
			cv2.CHAIN_APPROX_SIMPLE)
		anoCnts = anoCnts[0] if imutils.is_cv2() else anoCnts[1]
		anoCnts = contours.sort_contours(anoCnts, method="left-to-right")[0]
		clone = np.dstack([group.copy()] * 3)
	
	for a in anoCnts:
		# compute the bounding box of the contour and draw it on our
		# image
		(x, y, w, h) = cv2.boundingRect(a)
		#sum_w = sum_w + w
		sum_h = sum_h + h
	for b in anoCnts:
		(x, y, w, h) = cv2.boundingRect(b)
		if(h < (sum_h)/len(refCnts)):
			continue
		else:
			cv2.rectangle(clone, (x, y), (x + w, y + h), (0, 255, 0), 2)
			#group = clone[y - 2:y + h + 2, x - 2:x + w + 2]
	 		group = clone[y :y + h , x :x + w]

		#filename = "/home/dank-engine/Desktop/output.jpg"
		#cv2.imwrite(filename, group)
		cv2.imshow("shit", group)
		cv2.waitKey(0)
	sum_h = 0

"""
# create a clone of the original image so we can draw on it
clone = np.dstack([ref.copy()] * 3)
sum_w = 0
sum_h = 0
# loop over the (sorted) contours
for c in refCnts:
	# compute the bounding box of the contour and draw it on our
	# image
	(x, y, w, h) = cv2.boundingRect(c)
	#sum_w = sum_w + w
	sum_h = sum_h +h
for b in refCnts:
	(x, y, w, h) = cv2.boundingRect(b)
	if(h < (sum_h)/len(refCnts)):
		continue
	else:
		cv2.rectangle(clone, (x, y), (x + w, y + h), (0, 255, 0), 2)
		#group = clone[y - 2:y + h + 2, x - 2:x + w + 2]
 		group = clone[y :y + h , x :x + w]

# show the output of applying the simple contour method
	#filename = "/home/dank-engine/Desktop/output.jpg"
	#cv2.imwrite(filename, group)

cv2.imshow("Simple Method", clone)
cv2.waitKey(0)
"""
