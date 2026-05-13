"use client"
import blog_data from "@/data/BlogData"
import Image from "next/image"
import Link from "next/link"

const BlogArea = () => {

  const blog = blog_data.filter((items) => items.page === "inner_2")[0];

  return (
    <div className="tg-blog-standard-area pt-130 pb-100">
      <div className="container">
        <div className="row justify-content-center">
          
          <div className="col-xl-8 col-lg-10">
            <div className="tg-blog-standard-wrap tg-blog-lg-spacing">

              <div className="tg-blog-standard-item mb-40">

                <div className="tg-blog-standard-thumb mb-15">
                  <Image className="w-100" src={blog.thumb} alt="blog" />
                </div>

                <div className="tg-blog-standard-content">
                  <div className="tg-blog-standard-date mb-10">
                    <span>by Admin</span>
                    <span>{blog.date}</span>
                    <span>{blog.time}</span>
                  </div>

                  <h2 className="tg-blog-standard-title">
                    {blog.title}
                  </h2>

                  <p className="mb-20">{blog.desc}</p>

                  {/* <Link href="/blog-details" className="tg-btn">
                    Read More
                  </Link> */}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default BlogArea
