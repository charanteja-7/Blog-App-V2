import React from "react";

const About = () => {
  return (
    <div className="max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto">
      <div className="max-w-2xl pt-10">
        <div className="space-y-5 md:space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold md:text-3xl dark:text-white">
              Inspiring Voices, One Blog at a Time
            </h2>

            <p className="text-lg text-gray-800 dark:text-neutral-200">
              Hello! I’m Charan Teja Chukkala, the creator of Blog App. I’m
              excited to share this platform with you, a space where everyone
              can express their thoughts, experiences, and creativity through
              blogs.
            </p>
          </div>

          <p className="text-lg text-gray-800 dark:text-neutral-200">
            As a passionate developer, I wanted to create a community that
            allows individuals to share their stories and connect with others.
            Inspired by my own experiences, I built Blog App to empower people
            to express themselves and engage in meaningful discussions.
          </p>

          <figure>
            <img
              className="w-full object-cover rounded-xl"
              src="https://www.rankhigher.in/uploads/1639030161.jpg"
              alt="Blog Image"
            />
            <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-neutral-500">
              Building Connections: A Community of Voices
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 dark:text-neutral-200">
            At Blog App, my mission is to foster a welcoming environment where
            diverse voices can be heard. Whether you’re a seasoned blogger or
            just starting out, this platform is for you!
          </p>
          <h4 className="text-1xl font-bold md:text-2xl dark:text-white">
            Core Features
          </h4>
          <ul className="text-lg text-gray-800 dark:text-neutral-200 ml-5">
            <li className="list-disc">Upload Your Blog</li>
            <li className="list-disc"> Easily write and publish your own posts.</li>
            <li className="list-disc">Engage with Others</li>
            <li className="list-disc">
              Like and comment on blogs to share your thoughts and connect with
              the community.
            </li>
            <li className="list-disc">
              Browse through a variety of blogs on different subjects.
            </li>
          </ul>
          <h5 className="text-1xl font-bold md:text-2xl dark:text-white">
            Community Guidelines
          </h5>
          <p className="text-lg text-gray-800 dark:text-neutral-200">
            To ensure a positive experience for everyone, I encourage all users
            to:
            <ul className="text-lg text-gray-800 dark:text-neutral-200 ml-5">
              <li className="list-disc">Be respectful in comments.</li>
              <li className="list-disc">
                {" "}
                Easily write and publish your own posts.
              </li>
              <li className="list-disc">Share constructive feedback.</li>
              <li className="list-disc">
                Support one another in our blogging journeys
              </li>
            </ul>
          </p>

          <blockquote className="text-center p-4 sm:px-7">
            <p className="text-xl font-medium text-gray-800 md:text-2xl md:leading-normal xl:text-2xl xl:leading-normal dark:text-neutral-200">
              Blogging is not just a job; it’s a way of life.
            </p>
            <p className="mt-5 text-gray-800 dark:text-neutral-200">Anonymous</p>
          </blockquote>

          <figure>
            <img
              className="w-full object-cover rounded-xl"
              src="https://media.licdn.com/dms/image/C5612AQFqEuRmOMBppg/article-cover_image-shrink_720_1280/0/1584620498125?e=2147483647&v=beta&t=_czZqgASwI6vT4EyT-m8QGBRpg_6c9dg3QB8xYpluQM"
              alt="Blog Image"
            />
            <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-neutral-500">
              Capturing Ideas: The Journey of Blogging
            </figcaption>
          </figure>
          <h5 className="text-1xl font-bold md:text-2xl dark:text-white">
            Get in Touch
          </h5>
          <p className="text-lg text-gray-800 dark:text-neutral-200">
            I’d love to hear from you! For any questions, feedback, or
            collaboration inquiries, feel free to reach out at{" "}
            <span
              className="text-blue-600 decoration-2  focus:outline-none  font-medium dark:text-blue-500"
              href="#"
            >
              chukkalacharanteja9@gmail.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
