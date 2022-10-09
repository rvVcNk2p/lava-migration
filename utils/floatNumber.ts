/**
 * Retund a 4 decimal number with fixed 2 decimal.
 */

export const ParseFloat4E = (str, val) => {
	str = str.toString()
	return (
		parseInt(str.slice(0, str.indexOf('.') + val + 1).replace('.', '')) * 1e4
	)
}
