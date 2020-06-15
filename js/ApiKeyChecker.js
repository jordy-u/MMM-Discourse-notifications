const apiKeyError = {
	"NO_ERROR":0,
	"KEY_IS_UNDEFINED_OR_NOT_A_STRING":1,
	"KEY_IS_EMPTY":2,
	"KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS":3
};
Object.freeze(apiKeyError);


/**
 * Check if the apiKey has the right format before using it.
	 * @param {string} apiKey
	 * @return {Object} success, error, errorMsg, formattedKey
	 */
function checkDiscourseApiKey(apiKey) {

	//check if key is defined
	if (typeof apiKey == "undefined") {

		return {
			success : false,
			error : apiKeyError.KEY_IS_UNDEFINED_OR_NOT_A_STRING,
			errorMsg : "'UserApiKey' is not defined in config.js or is not a string.",
		};
	}

	apiKey = apiKey.toLowerCase();

	//Remove spaces at the start and end of the key.
	apiKey = apiKey.trim();

	//check if key is not empty
	if (apiKey.length === 0) {
		return {
			success : false,
			error : apiKeyError.KEY_IS_EMPTY,
			errorMsg : "'UserApiKey' in config.js is an empty string.",
		};
	}


	//check if key is a lowercase hexadecimal string
	if (apiKey.match("^[a-f0-9]{32}$") === null) {
		return {
			success : false,
			error : apiKeyError.KEY_DOES_NOT_EQUAL_32_HEXADECIMAL_NUMBERS,
			errorMsg : "The provided API key has a wrong format. It should be a string of 32 hexadecimal numbers.",
		};
	}

	//Check passed.
	return {
		success : true,
		error : apiKeyError.NO_ERROR,
		errorMsg : "No error",
		formattedKey : apiKey,
	};
}

module.exports = {apiKeyError, checkDiscourseApiKey};