const mMime = require('mime-types')
export class MyHelper {




    static isAnPngImage(mimeT) {
 let imageExt =  mMime.extension(mimeT);        
        return imageExt == "png";    }


    public static categoriesSvgImagePath = "./uploads/categories/"
    public static productImagePath = "./uploads/products/"
    
    public static getImageExtinction ( mimeType : string) {
        let imageExt =  mMime.extension(mimeType);        
        return imageExt;        
    }


    public static itIsAnSvgImage(mime : string) { 
        let imageExt =  mMime.extension(mime);        
        return imageExt == "svg";
    }

}
