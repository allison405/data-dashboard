# Web Development Project 5 - *Digital Library Pt. 2*

Submitted by: **Allison Lee**

This web app: **Acts as a search database for users to browse and search for books by title, or look by the language. A small data spread is also displayed at the top of the page to show the number of books appearing for the search, the mean number of editions there are among all the books, and the number of books that are from before 2000. Two charts are also displaed to show distributions of the books in different years and the top 5 books by the number of editions. Clicking into the books on view details will provide more information regarding the book. To navigate back to the home page, users can click the back button at the top of the page, or hit dashboard home in the new sidebar.**

Time spent: **5** hours spent in total


## Required Features

The following **required** functionality is completed:

- [X] **Clicking on an item in the list view displays more details about it**
  - Clicking on an item in the dashboard list navigates to a detail view for that item
  - Detail view includes extra information about the item not included in the dashboard view
  - The same sidebar is displayed in detail view as in dashboard view
  - *To ensure an accurate grade, your sidebar **must** be viewable when showing the details view in your recording.*
- [X] **Each detail view of an item has a direct, unique URL link to that item’s detail view page**
  -  *To ensure an accurate grade, the URL/address bar of your web browser **must** be viewable in your recording.*
- [X] **The app includes at least two unique charts developed using the fetched data that tell an interesting story**
  - At least two charts should be incorporated into the dashboard view of the site
  - Each chart should describe a different aspect of the dataset


The following **optional** features are implemented:

- [X] The site’s customized dashboard contains more content that explains what is interesting about the data 
  - e.g., an additional description, graph annotation, suggestion for which filters to use, or an additional page that explains more about the data
- [ ] The site allows users to toggle between different data visualizations
  - User should be able to use some mechanism to toggle between displaying and hiding visualizations 

  
The following **additional** features are implemented:

* [ ] List anything else that you added to improve the site's functionality!

## Video Walkthrough

Here's a walkthrough of implementation:
<img width="480" height="334" alt="gif (4)" src="https://github.com/user-attachments/assets/182f0bc4-e4aa-4b1f-8b30-68fa6aee6127" />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  giphy.com

## Notes

Starting from the previous data dashboard was a bit of a confusing process initially, as I had to change up and reorder a lot of things, such as the main page layout. Instead of having one return function, I needed to have it display two separate sections for the main display and the sidebar. Implementing the graphs with special hover effects was something I personally was interested in doing and was happy with how the results turned out! It took a bit of time to figure out how to display the graphs with the recharts library, but being able to have completed a display like so was very rewarding. Making sure that each book also had a unique url link was an interesting experience. 

## License

    Copyright [2026] [Allison Lee]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
