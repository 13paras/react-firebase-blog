/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import Card from "../components/Card";
import CardSkeleton from "../components/skeleton/CardSkeleton";

const SearchResults = () => {
  const { query: searchQuery } = useParams();
  const [loading, setLoading] = useState(true);
  const [blogsData, setBlogsData] = useState(null);
  const [filteredBlogs, setFilteredBlogs] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        return toast.error("Search term is empty");
      }

      setLoading(true);

      try {
        const blogRef = collection(db, "blogs");
        const q = query(blogRef, orderBy("timestamp", "desc"));
        const docSnap = await getDocs(q);

        const blogs = [];
        docSnap.forEach((doc) => {
          blogs.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setBlogsData(blogs);
        console.log(blogsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast.error("Sorry! There was an error retrieving search results.");
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  useEffect(() => {
    if (blogsData) {
      setLoading(true);
      const filteredData = blogsData.filter((blog) =>
        blog.data.blogData.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filteredData);
      setLoading(false);
      console.log("Filtered Blogs: ", filteredBlogs);
    }
  }, [searchQuery, blogsData]);

  return (
    <main className='mx-auto max-w-7xl'>
      <div className='mt-10'>
        <Search />
      </div>

      <div className='my-12 pl-10'>
        <p className='text-3xl'>
          You searched for
          <q>
            {" "}
            <strong>{searchQuery}</strong>
          </q>{" "}
        </p>
      </div>

      <section>
        {!loading ? (
          filteredBlogs?.length > 0 ? (
            filteredBlogs.map((blog, index) => (
              <Card key={index} id={blog.id} blog={blog.data} />
            ))
          ) : (
            <>
            <p className="text-2xl font-semibold text-center text-sky-500 mt-20 uppercase">
              No blogs found for the search term: <q className="underline decoration-wavy decoration-green-800"> {searchQuery} </q>.
            </p>
            <img className="bg-transparent w-[60%] rounded-lg mx-auto mt-12" src="https://img.freepik.com/free-vector/hand-drawn-no-data-illustration_23-2150696467.jpg?w=826&t=st=1707572418~exp=1707573018~hmac=af1032c6391a3cd3bedbd1a2537bc8964cc9477119c8281ba447724333f933bb" alt="error-image" />
            </>
          )
        ) : (
          <div className='mx-auto mt-12 grid w-[95%] grid-cols-1 gap-5 text-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
            {/* Show Skeleton component as a placeholder while data is loading */}
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default SearchResults;
