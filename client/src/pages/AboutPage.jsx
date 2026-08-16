import { ArrowLeft } from "lucide-react";
import React from "react";
import {
  FaGithub,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

import {
  FiExternalLink,
  FiCode,
  FiBriefcase,
  FiMessageCircle,
  FiMonitor,
  FiServer,
  FiTool,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import profile from "../assets/Me.jpeg"

const AboutPage = () => {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <button className="flex gap-2 items-center mb-5 cursor-pointer hover:text-blue-300 transition"
        onClick={()=> navigate("/")}
        >
          <ArrowLeft size={18}/> Home
        </button>

        {/* Profile */}
        <section className="text-center">

          <img
            src={profile}
            alt="Krishan Das"
            className="w-40 h-40 rounded-full object-cover mx-auto border-4 border-white dark:border-slate-800 shadow-lg"
          />

          <h1 className="mt-5 text-3xl font-bold">
            Krishan Das
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Developer & Creator of LabSync
          </p>

          <p className="max-w-2xl mx-auto mt-5 text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">
            I'm a Computer Science & Engineering student and developer
            interested in building practical software that solves real-world
            problems.
          </p>

        </section>


        {/* About LabSync */}
        <section className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">

          <div className="flex items-center gap-3">
            <FiCode className="w-5 h-5 text-blue-600" />

            <h2 className="text-xl font-semibold">
              About LabSync
            </h2>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-300">
            LabSync was created to make college laboratory work easier to
            manage. It helps students save their code and output screenshots,
            access them from anywhere, and prepare output screenshots for
            printing using ready-made templates.
          </p>

        </section>


        {/* What I Do */}
<section className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">

  <h2 className="text-xl font-semibold">
    What I Do
  </h2>

  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
    I enjoy building practical software and learning by creating real-world
    projects.
  </p>

  <div className="mt-6 grid sm:grid-cols-2 gap-4">

    {/* Full Stack */}
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
      <div className="flex items-center gap-2">
        <FiCode className="text-blue-600" />

        <h3 className="font-medium">
          Full-Stack Development
        </h3>
      </div>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Building complete web applications using React, Node.js,
        Express.js and MongoDB.
      </p>
    </div>

    {/* Flutter */}
<div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
  <div className="flex items-center gap-2">
    <FiMonitor className="text-blue-600" />

    <h3 className="font-medium">
      Flutter Development
    </h3>
  </div>

  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
    Building cross-platform mobile applications using Flutter and Dart.
  </p>
</div>

    {/* Backend */}
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
      <div className="flex items-center gap-2">
        <FiServer className="text-blue-600" />

        <h3 className="font-medium">
          Backend & APIs
        </h3>
      </div>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Developing REST APIs, authentication systems and server-side
        applications with Node.js and Express.js.
      </p>
    </div>

    {/* Projects */}
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
      <div className="flex items-center gap-2">
        <FiTool className="text-blue-600" />

        <h3 className="font-medium">
          Building Real Projects
        </h3>
      </div>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Building and experimenting with practical projects such as
        LabSync and developer-focused applications.
      </p>
    </div>

  </div>

</section>


        {/* Contact */}
        <section className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">

          <h2 className="text-xl font-semibold">
            Connect With Me
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">

            {/* GitHub */}
            <a
              href="https://github.com/Krishan-Das"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              <FaGithub size={17} />
              GitHub
              <FiExternalLink size={13} />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/code_by_krish"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              <FaInstagram size={17} />
              Instagram
              <FiExternalLink size={13} />
            </a>

            {/* Email */}
            <a
              href="mailto:krishan8974783135@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
            >
              <FaEnvelope size={17} />
              Contact Me
            </a>

          </div>

        </section>

      </div>
    </div>
  );
};

export default AboutPage;