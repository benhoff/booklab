import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http/http.service';
import {UserService} from '../../services/user/user.service';
import {Book, DetectionResult, Title} from '../../dataTypes';

@Component({
    selector: 'app-image',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.less']
})

/**
 * Class for the image upload component, handles the uploading of an image and can add it to the bookshelf.
 */
export class ImageUploadComponent implements OnInit {
    public img: any;
    public results: Book[];
    public addedToShelf: boolean;

    /**
     * Constructor for ImageUploadComponent.
     * @param {HttpService} http
     * @param {UserService} user
     */
    constructor(private http: HttpService, private user: UserService) {
    }

    ngOnInit() {
        this.img = null;
        this.results = [];
        this.addedToShelf = false;
    }

    /**
     * Invoked by the image upload button, sends the image from the event to the backend for processing.
     * @param event: contains the image from the input element
     */
    onSubmit(event) {
        console.log('click!');
        const files = event.srcElement.files;
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            this.img = reader.result;
            this.http.checkHealth();
            this.http.putImg(ImageUploadComponent.toBlob(this.img)).subscribe((res) => {
                this.results = res.results.map(b => Book.getBook(b));
            }, error => this.http.handleError(error));
        };
        this.addedToShelf = false;

    }

    /**
     * Adds the books found in the picture to the bookshelf.
     * @param {Event} event
     */
    addToBookShelf(event: Event) {
        console.log('click!');
        this.user.addMultToBookshelf(this.results);
        this.addedToShelf = true;
    }

    /**
     * Deletes a book from the list of books to be added to the bookshelf.
     * @param {Book} book: book to be deleted
     */
    deleteBook(book: Book) {
        this.results = this.addedToShelf? this.results :
            this.results.filter(b => b.getMainTitle()!=book.getMainTitle());
    }

    loadDummy() {

          this.results =  [ new Book([new Title('Beautiful Evidence', 'MAIN')],[ "Edward R. Tufte"],[ "0961392177", "9780961392178" ]),
         new Book([new Title('Effective Interviewing and Interrogation Techniques', 'MAIN')],[ "William L. Fleisher", "Nathan J. Gordon"],[ "0123819873", "9780123819871" ]),
         new Book([new Title('Negotiating For Dummies', 'MAIN')],[ "Donaldson"],[ "9781118068083", "1118068084" ]),
         new Book([new Title('Applications = Code + Markup: A Guide to the Microsoft® Windows® Presentation Foundation', 'MAIN')],[ "Charles Petzold"],[ "9780735638631", "0735638632" ]),
         new Book([new Title('Developing Applications with Microsoft Office 95', 'MAIN')],[ "Christine Solomon"],[ "155615898X", "9781556158988" ]),
         new Book([new Title('How to Solve It: Modern Heuristics', 'MAIN')],[ "Zbigniew Michalewicz", "David B. Fogel"],[ "9783662041314", "3662041316" ]),
         new Book([new Title('How to Solve It: Modern Heuristics', 'MAIN')],[ "Zbigniew Michalewicz", "David B. Fogel"],[ "9783662041314", "3662041316" ]),
         new Book([new Title('How to Solve It: Modern Heuristics', 'MAIN')],[ "Zbigniew Michalewicz", "David B. Fogel"],[ "9783662041314", "3662041316" ]),
         new Book([new Title('Professional Visual Studio 2005 Team System', 'MAIN')],[ "Jean-Luc David"],[ "9780764584367", "0764584367" ]),
         new Book([new Title('The Complete Reference to Professional Soa with Visual Studio 2005 (C# & VB 2005) .Net 3.0', 'MAIN')],[ "Tom Gao"],[ "9781847998354", "1847998356" ]),
         new Book([new Title('Programming C# 4.0', 'MAIN')],[ "Ian Griffiths", "Matthew Adams", "Jesse Liberty"],[ "9781449399726", "144939972X" ]),
         new Book([new Title('Foundations of WPF', 'MAIN')],[ "Laurence Moroney"],[ "1430203609", "9781430203605" ]),
         new Book([new Title('Old New Thing', 'MAIN')],[ "Raymond Chen"],[ "9780132701648", "0132701642" ]),
         new Book([new Title('Old New Thing', 'MAIN')],[ "Raymond Chen"],[ "9780132701648", "0132701642" ]),
         new Book([new Title('Suzan Van de Roemer', 'MAIN')],[ "Suzan van de Roemer", "Eddy Veerman"],[ "9053307494", "9789053307496" ]),
         new Book([new Title('Robogenesis', 'MAIN')],[ "Daniel Wilson"],[ "9789021458601", "9021458608" ]),
         new Book([new Title('First, Break All The Rules', 'MAIN')],[ "Marcus Buckingham", "Curt Coffman"],[ "9780684852867", "0684852861" ]),
         new Book([new Title('First, Break All The Rules', 'MAIN')],[ "Marcus Buckingham", "Curt Coffman"],[ "9780684852867", "0684852861" ]),
         new Book([new Title('Zagazoo', 'MAIN')],[ "Quentin Blake"],[ "902611432X", "9789026114328" ]),
         new Book([new Title('Pick Me Up', 'MAIN')],[ "Zoe Rice"],[ "9780755354979", "0755354974" ]),
         new Book([new Title('Welcome to the Caribbean, Darling!', 'MAIN')],[ "Michiel van Kempen"],[ "9789056294960", "9056294962" ]),
         new Book([new Title('Badgasten', 'MAIN')],[ "Emma Straub"],[ "9789026331008", "9026331002" ]),
         new Book([new Title('Made to Stick', 'MAIN')],[ "Chip Heath", "Dan Heath"],[ "9781407008240", "1407008242" ]),
         new Book([new Title('Tiger Woods', 'MAIN')],[ "Jeff Benedict", "Armin Keteyian"],[ "9789460038464", "9460038468" ]),
         new Book([new Title('Hobbies', 'MAIN')],[ "Otto C. Lightner", "Pearl Ann Reeder"],[ ])];
    }

    /**
     * Helper method to convert the given data URI to a blob.
     *
     * @param uri The data uri to convert.
     * @returns {Blob} The resulting binary blob.
     */
    private static toBlob(uri) {
        // convert base64 to raw binary data held in a string
        const byteString = atob(uri.split(',')[1]);

        // separate out the mime component
        const mimeString = uri.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const _ia = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }

        const dataView = new DataView(arrayBuffer);
        return new Blob([dataView], { type: mimeString });
    }
}
