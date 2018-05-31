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

package nl.tudelft.booklab.recommender.rating.google

import nl.tudelft.booklab.catalogue.Book
import nl.tudelft.booklab.recommender.Recommender

/**
 * a [Recommender] that recommends solely based on the ratings from GoodReads
 * [GoogleBooksRatingRecommender] implements the [Recommender] interface
 *
 * @property client the HTTP client used to connect with the Goodreads
 * database
 * @property key the Goodreads API key
 *
 * @author Christian Slothouber (f.c.slothouber@student.tudelft.nl)
 */
class GoogleBooksRatingRecommender : Recommender {

    override suspend fun recommend(collection: Set<Book>, candidates: Set<Book>): List<Book> {
        return candidates
            .filter { it.rating != null }
            .filter { !collection.contains(it) }
            .sortedByDescending { it.rating }
    }
}
