import { debounce } from 'lodash'
import { Dispatch, SetStateAction } from 'react'

export const createDebouncedSearch = (
	setSearchQuery: Dispatch<SetStateAction<string>>,
	delay: number = 300
) => {
	return debounce(setSearchQuery, delay)
}
