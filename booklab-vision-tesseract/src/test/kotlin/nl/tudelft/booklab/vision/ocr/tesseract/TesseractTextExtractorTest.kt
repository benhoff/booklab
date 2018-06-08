/*
 * Copyright 2018 The BookLab Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package nl.tudelft.booklab.vision.ocr.tesseract

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.opencv.core.MatOfByte
import org.opencv.imgcodecs.Imgcodecs.CV_LOAD_IMAGE_UNCHANGED
import org.opencv.imgcodecs.Imgcodecs.imdecode

class TesseractTextExtractorTest {
    @Test
    fun `smoke test`() {
        val data = BasicTesseractExampleTest::class.java.getResourceAsStream("/tesseract/languages/english")
        Tesseract(data, emptyMap()).use {
            val stream = TesseractTextExtractorTest::class.java.getResourceAsStream("/bookshelf.jpg")
            val image = imdecode(MatOfByte(*stream.readBytes()), CV_LOAD_IMAGE_UNCHANGED)
            val ocr = TesseractTextExtractor(it)
            val res = ocr.extract(image)
            assertTrue(res.isNotEmpty())
        }
    }

    companion object {
        init {
            nu.pattern.OpenCV.loadShared()
            System.loadLibrary(org.opencv.core.Core.NATIVE_LIBRARY_NAME)
        }
    }
}
