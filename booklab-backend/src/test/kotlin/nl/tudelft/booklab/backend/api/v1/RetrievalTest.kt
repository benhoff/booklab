/*
 * Copyright 2018 The BookLab Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package nl.tudelft.booklab.backend.api.v1

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.google.cloud.vision.v1.ImageAnnotatorClient
import com.typesafe.config.ConfigFactory
import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.config.HoconApplicationConfig
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.routing.route
import io.ktor.routing.routing
import io.ktor.server.testing.createTestEnvironment
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withApplication
import nl.tudelft.booklab.backend.VisionConfiguration
import nl.tudelft.booklab.catalogue.sru.SruClient
import nl.tudelft.booklab.vision.detection.opencv.VisionBookDetector
import nl.tudelft.booklab.vision.ocr.gvision.GoogleVisionTextExtractor
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvFileSource
import java.io.File
import kotlin.test.assertTrue

/**
 * Integration test suite for the detection and retrieval of books
 *
 */
internal class RetrievalTest {
    /**
     * The Jackson mapper class that maps JSON to objects.
     */
    private lateinit var mapper: ObjectMapper

    @BeforeEach
    fun setUp() {
        mapper = jacksonObjectMapper()
    }

    @ParameterizedTest
    @CsvFileSource(resources = ["/test-data.csv"])
    fun `some correct books are retrieved`(bookshelf: String, titles: String, authors: String) = withApplication(detectionEnvironment()) {
        val titles = File(RetrievalTest::class.java.getResource(titles).file).readLines()
        val image = RetrievalTest::class.java.getResourceAsStream(bookshelf).readBytes()
        val request = handleRequest(HttpMethod.Post, "/api/detection") {
            setBody(image)
            addHeader(HttpHeaders.ContentType, ContentType.Application.OctetStream.toString())
        }
        with(request) {
            assertEquals(HttpStatusCode.OK, response.status())
            val response: DetectionResult? = response.content?.let { mapper.readValue(it) }
            val responseTitles = response?.results?.map { book -> book.titles[0].value }
            val intersection = titles.intersect(responseTitles!!.asIterable())

            assertTrue(intersection.isNotEmpty())
        }
    }

    private fun detectionEnvironment() = createTestEnvironment {
        config = HoconApplicationConfig(ConfigFactory.load("application-test.conf"))
        module { detectionModule() }
    }

    private fun Application.detectionModule() {
        install(ContentNegotiation) {
            jackson {
                configure(SerializationFeature.INDENT_OUTPUT, true)
                registerModule(JavaTimeModule())
            }
        }

        routing {
            route("/api/detection") {
                detection(
                    VisionConfiguration(
                        detector = VisionBookDetector(),
                        extractor = GoogleVisionTextExtractor(ImageAnnotatorClient.create()),
                        client = SruClient()
                    )
                )
            }
        }
    }
}
