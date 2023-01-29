import numpy as np
import imageio.v2 as imageio

filenames = ["whiteking.svg.png", "blackking.svg.png",
			 "whitequeen.svg.png", "blackqueen.svg.png",
			 "whitebishop.svg.png", "blackbishop.svg.png",
			 "whiteknight.svg.png", "blackknight.svg.png",
			 "whiterook.svg.png", "blackrook.svg.png",
			 "whitepawn.svg.png", "blackpawn.svg.png"]
paddingToRemove = 6

for filename in filenames:
	image = imageio.imread(filename)
	newImage = image[paddingToRemove:image.shape[0] - paddingToRemove,
					 paddingToRemove:image.shape[1] - paddingToRemove]
	imageio.imwrite(filename, newImage)


'''
image = imageio.imread(filename)
print(image.shape)

newValues = image[reductionAmount:image.shape[0]-reductionAmount, reductionAmount:image.shape[1]-reductionAmount]
print(newValues.shape)

newFilename = "whiteking3.svg.png"
newFilename = "blackpawn2.svg.png"

imageio.imwrite(newFilename, newValues)
'''