"use client";
import { useState } from "react";
import { ArrowUpRight, GitFork, Github, Search } from "lucide-react";
import type {Repository} from "@/data/schema";
import { repositoryPath, repoLabels } from "@/data/repositories";

export function RepositoryCatalog({repositories}:{repositories:Repository[]}) {
  const [filter, setFilter] = useState("all"),
    [term, setTerm] = useState("");
  const filters = [
    ["all", "All"],
    ["source", "Source code"],
    ["readme", "README only"],
    ["empty", "Empty"],
  ];
  const matched = repositories.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      [
        r.title,
        r.name,
        r.language,
        r.category,
        r.summary,
        r.upstream ? "fork" : "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(term.trim().toLowerCase()),
  );
  return (
    <>
      <div className="archive-tools">
        <div
          className="archive-filters"
          role="group"
          aria-label="Filter by repository contents"
        >
          {filters.map(([key, title]) => (
            <button
              key={key}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {title}{" "}
              <span>
                {key === "all"
                  ? repositories.length
                  : repositories.filter((r) => r.status === key).length}
              </span>
            </button>
          ))}
        </div>
        <label className="repo-search">
          <Search size={16} />
          <input
            aria-label="Search repositories"
            placeholder="Search repositories"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </label>
      </div>
      <p role="status" className="sr-only">
        {matched.length} repositories shown
      </p>
      <div className="archive-grid">
        {matched.map((r) => (
          <article key={r.name} className="repo-card">
            <div className="repo-kicker">
              <span>{r.category}</span>
              {r.upstream && (
                <span className="fork">
                  <GitFork size={13} />
                  Fork
                </span>
              )}
            </div>
            <h2>
              <a href={repositoryPath(r)}>{r.title}</a>
            </h2>
            <p>{r.summary}</p>
            <div className="repo-card-meta">
              {r.language && <span>{r.language}</span>}
              {r.status !== "source" && <span>{repoLabels[r.status]}</span>}
            </div>
            <div className="repo-card-links">
              <a href={repositoryPath(r)}>
                {r.caseStudy ? "Case study" : "Project details"}{" "}
                <ArrowUpRight size={14} />
              </a>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                aria-label={"View " + r.name + " on GitHub"}
              >
                <Github size={15} />
                GitHub
              </a>
            </div>
          </article>
        ))}
      </div>
      {matched.length === 0 && (
        <div className="archive-empty">
          <p>No repositories match your search.</p>
          <button
            className="btn secondary"
            onClick={() => {
              setFilter("all");
              setTerm("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
