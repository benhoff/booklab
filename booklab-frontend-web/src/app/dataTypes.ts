import {isUndefined} from 'util';

/**
 * Class to model a book title.
 */
export class Title {

    /**
     * Constructor for Title.
     * @param {string} value
     * @param {string} type
     */
    constructor(public value: string,
                public type: string) {
    }
}

/**
 * Class to model a book.
 */
export class Book {

    /**
     * Constructor for Book.
     * @param {Title[]} titles
     * @param {string[]} authors
     * @param {string[]} ids
     * @param {boolean} isSearched
     */
    constructor(public titles: Title[],
                public authors: string[],
                public ids: string[],
                public isSearched: boolean = false) {
    }

    /**
     * Returns a new book with given data.
     * @param b container for data in the book
     * @returns {Book} a new Book
     */
    static getBook(b: any): Book {
        if (isUndefined(b)) {
            return new Book([new Title('Didn\'t find your book!', 'MAIN')], [''], ['']);
        }
        return new Book(b.titles, b.authors, b.ids);
    }

    static create(title: string, author: string, id: string): Book {
        return new Book([new Title(title, 'MAIN')], [author], [id]);
    }


    /**
     * Searches the main title of the book.
     * @returns {string} result of the search, string is empty if the book didn't have a main title
     */
    getMainTitle(): string {
        if (this.titles.length === 0) {
            return '';
        }
        const res = this.titles.find(t => t.type === 'MAIN');
        return isUndefined(res) ? '' : res.value;
    }

}

/**
 * Interface to represent the results coming from the api.
 */
export interface DetectionResult {
    results: BookDetection[];
}

export interface BookDetection {
    matches: Book[];
    box: {
        x: number,
        y: number,
        width: number,
        height: number
    }
}

export class BookItem {
    constructor(public book: Book,
                public checked: boolean = true,
                public addedToShelf = false) {
    }
}

export class Secure {

    static checkInput(input: string): string {
        let res: string;
        res = input.replace('%0d%0a', '');
        return res;
    }

    constructor() {
    }
}
