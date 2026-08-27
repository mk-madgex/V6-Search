(() => {
  "use strict";

  const { jobs, facets, locations, taxonomies = {} } = window.SEARCH_DATA;
  const pageSize = 5;
  const state = {
    criteria: {
      keyword: "",
      location: "",
      distance: 20,
      nationwide: false,
      homeworking: false
    },
    selected: Object.fromEntries(facets.map(({ key }) => [key, new Set()])),
    draftSelected: Object.fromEntries(facets.map(({ key }) => [key, new Set()])),
    expanded: new Set(["sector"]),
    branchOpen: new Set(["sector:Healthcare", "jobTitle:Scientist"]),
    saved: new Set(),
    page: 1
  };

  const elements = {
    form: document.querySelector("#search-form"),
    keyword: document.querySelector("#keyword"),
    location: document.querySelector("#location"),
    distance: document.querySelector("#distance"),
    nationwide: document.querySelector("#nationwide"),
    homeworking: document.querySelector("#homeworking"),
    clear: document.querySelector("#clear-filters"),
    locationOptions: document.querySelector("#location-options"),
    facetGroups: document.querySelector("#facet-groups"),
    activeFilters: document.querySelector("#active-filters"),
    count: document.querySelector("#result-count"),
    list: document.querySelector("#job-list"),
    pagination: document.querySelector("#pagination"),
    pendingNote: document.querySelector("#pending-note")
  };

  const facetValues = Object.fromEntries(
    facets.map(({ key }) => [key, [...new Set(jobs.map((job) => job[key]))].sort()])
  );

  function taxonomyFor(key) {
    return taxonomies[key] || null;
  }

  function leavesForParent(key, parentLabel) {
    return taxonomyFor(key)?.find((node) => node.label === parentLabel)?.children || [];
  }

  function parentForLeaf(key, leaf) {
    return taxonomyFor(key)?.find((node) => node.children.includes(leaf))?.label || null;
  }

  function leafCount(key, leaf, candidates) {
    return candidates.filter((job) => job[key] === leaf).length;
  }

  function parentCount(key, parentLabel, candidates) {
    const leaves = new Set(leavesForParent(key, parentLabel));
    return candidates.filter((job) => leaves.has(job[key])).length;
  }

  function isLeafSelected(key, leaf) {
    return state.draftSelected[key].has(leaf) || state.selected[key].has(leaf);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function toRadians(value) {
    return value * Math.PI / 180;
  }

  function distanceInMiles(from, to) {
    const earthRadius = 3958.8;
    const latDelta = toRadians(to.lat - from.lat);
    const lonDelta = toRadians(to.lon - from.lon);
    const a = Math.sin(latDelta / 2) ** 2
      + Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat))
      * Math.sin(lonDelta / 2) ** 2;
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function resolveLocation(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return null;
    return locations.find((item) => {
      const names = [item.name.toLowerCase(), ...item.aliases];
      return names.some((name) => name.includes(normalized) || normalized.includes(name));
    });
  }

  function matchesCore(job) {
    const { criteria } = state;
    const words = criteria.keyword.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = [
      job.title, job.company, job.summary, job.sector, job.jobTitle, job.location,
      parentForLeaf("sector", job.sector), parentForLeaf("jobTitle", job.jobTitle)
    ].join(" ").toLowerCase();

    if (!words.every((word) => haystack.includes(word))) return false;
    if (criteria.homeworking && !job.remote) return false;

    if (!criteria.nationwide && criteria.location.trim()) {
      const origin = resolveLocation(criteria.location);
      if (!origin) return false;
      if (job.remote) return true;
      if (distanceInMiles(origin, job) > criteria.distance) return false;
    }

    return true;
  }

  function matchesFacets(job, ignoredFacet = null) {
    return facets.every(({ key }) => {
      if (key === ignoredFacet || state.selected[key].size === 0) return true;
      return state.selected[key].has(job[key]);
    });
  }

  function filteredJobs(ignoredFacet = null) {
    return jobs.filter((job) => matchesCore(job) && matchesFacets(job, ignoredFacet));
  }

  function readSearchFields() {
    state.criteria = {
      keyword: elements.keyword.value,
      location: elements.location.value,
      distance: Number(elements.distance.value),
      nationwide: elements.nationwide.checked,
      homeworking: elements.homeworking.checked
    };
    state.page = 1;
  }

  function hasPendingChanges() {
    const { criteria } = state;
    const fieldsChanged = elements.keyword.value !== criteria.keyword
      || elements.location.value !== criteria.location
      || Number(elements.distance.value) !== criteria.distance
      || elements.nationwide.checked !== criteria.nationwide
      || elements.homeworking.checked !== criteria.homeworking;

    const facetsChanged = facets.some(({ key }) => {
      const draft = state.draftSelected[key];
      const applied = state.selected[key];
      return draft.size !== applied.size || [...draft].some((value) => !applied.has(value));
    });

    return fieldsChanged || facetsChanged;
  }

  function updatePendingNote() {
    elements.pendingNote.hidden = !hasPendingChanges();
  }

  function updateFacetSelectedCount(key) {
    const group = elements.facetGroups.querySelector(`details[data-group="${key}"]`);
    if (!group) return;
    const summary = group.querySelector("summary");
    const selectedCount = state.draftSelected[key].size;
    let badge = summary.querySelector(".facet-selected-count");
    if (selectedCount === 0) {
      badge?.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "facet-selected-count";
      summary.append(badge);
    }
    badge.textContent = `${selectedCount} selected`;
    badge.setAttribute("aria-label", `${selectedCount} selected`);
  }

  function applyDraftFilters() {
    facets.forEach(({ key }) => {
      state.selected[key] = new Set(state.draftSelected[key]);
    });
  }
  function renderFlatOptions(key, candidates) {
    return facetValues[key].map((value) => {
      const count = leafCount(key, value, candidates);
      const selected = isLeafSelected(key, value);
      if (count === 0 && !selected) return "";
      return renderLeafOption(key, value, count, selected);
    }).join("");
  }

  function renderLeafOption(key, value, count, selected) {
    return `
      <label class="facet-option">
        <input type="checkbox" data-facet="${escapeHtml(key)}" data-leaf="${escapeHtml(value)}" value="${escapeHtml(value)}" ${selected ? "checked" : ""}>
        <span>${escapeHtml(value)}</span>
        <span class="facet-count">${count}</span>
      </label>`;
  }

  function renderTreeOptions(key, candidates) {
    return taxonomyFor(key).map((node) => {
      const childMarkup = node.children.map((leaf) => {
        const count = leafCount(key, leaf, candidates);
        const selected = isLeafSelected(key, leaf);
        if (count === 0 && !selected) return "";
        return renderLeafOption(key, leaf, count, selected);
      }).join("");

      const count = parentCount(key, node.label, candidates);
      const selectedLeaves = node.children.filter((leaf) => isLeafSelected(key, leaf));
      if (count === 0 && selectedLeaves.length === 0) return "";

      const allSelected = node.children.every((leaf) => isLeafSelected(key, leaf));
      const someSelected = selectedLeaves.length > 0;
      const open = state.branchOpen.has(`${key}:${node.label}`);
      const icon = open ? "assets/triangle-down.svg" : "assets/triangle-right.svg";
      const iconAlt = open ? "Collapse" : "Expand";

      return `
        <div class="facet-branch${open ? " is-open" : ""}" data-branch="${escapeHtml(key)}:${escapeHtml(node.label)}">
          <div class="facet-option facet-option--parent">
            <label>
              <input type="checkbox" data-facet="${escapeHtml(key)}" data-parent="${escapeHtml(node.label)}" ${allSelected ? "checked" : ""} ${someSelected && !allSelected ? "data-indeterminate=\"true\"" : ""}>
              <span>${escapeHtml(node.label)}</span>
              <span class="facet-count">${count}</span>
            </label>
            <button class="facet-expand" type="button" data-toggle-branch="${escapeHtml(key)}:${escapeHtml(node.label)}" aria-expanded="${open}" aria-label="${iconAlt} ${escapeHtml(node.label)}">
              <img src="${icon}" alt="" width="14" height="14">
            </button>
          </div>
          <div class="facet-children">${childMarkup}</div>
        </div>`;
    }).join("");
  }

  function renderFacets() {
    const markup = facets.map(({ key, label }) => {
      const candidates = filteredJobs(key);
      const options = taxonomyFor(key)
        ? renderTreeOptions(key, candidates)
        : renderFlatOptions(key, candidates);

      if (!options.trim()) return "";
      const selectedCount = state.draftSelected[key].size;
      const countMarkup = selectedCount
        ? `<span class="facet-selected-count" aria-label="${selectedCount} selected">${selectedCount} selected</span>`
        : "";
      return `
        <details class="facet-group" data-group="${escapeHtml(key)}" ${state.expanded.has(key) ? "open" : ""}>
          <summary>
            <span class="facet-label">${escapeHtml(label)}</span>
            ${countMarkup}
          </summary>
          <div class="facet-options${taxonomyFor(key) ? " facet-options--tree" : ""}">${options}</div>
        </details>`;
    }).join("");

    elements.facetGroups.innerHTML = markup;
    elements.facetGroups.querySelectorAll("input[data-indeterminate]").forEach((input) => {
      input.indeterminate = true;
    });
  }

  function compactSelection(key) {
    const selected = state.selected[key];
    const tree = taxonomyFor(key);
    if (!tree) return [...selected].map((value) => ({ value, label: value, leaves: [value] }));

    const chips = [];
    const covered = new Set();
    tree.forEach((node) => {
      if (node.children.length && node.children.every((leaf) => selected.has(leaf))) {
        chips.push({ value: node.label, label: node.label, leaves: [...node.children] });
        node.children.forEach((leaf) => covered.add(leaf));
      }
    });
    selected.forEach((value) => {
      if (!covered.has(value)) chips.push({ value, label: value, leaves: [value] });
    });
    return chips;
  }

  function renderActiveFilters() {
    const filters = [];
    if (state.criteria.keyword.trim()) {
      filters.push({ type: "core", key: "keyword", label: `Keyword: ${state.criteria.keyword.trim()}` });
    }
    if (state.criteria.location.trim() && !state.criteria.nationwide) {
      filters.push({
        type: "core",
        key: "location",
        label: `${state.criteria.location.trim()} within ${state.criteria.distance} miles`
      });
    }
    if (state.criteria.nationwide) filters.push({ type: "core", key: "nationwide", label: "Nationwide" });
    if (state.criteria.homeworking) filters.push({ type: "core", key: "homeworking", label: "Homeworking" });
    facets.forEach(({ key }) => {
      compactSelection(key).forEach((chip) => {
        filters.push({ type: "facet", key, value: chip.value, leaves: chip.leaves, label: chip.label });
      });
    });

    elements.activeFilters.replaceChildren();
    filters.forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.textContent = `${filter.label} ×`;
      button.setAttribute("aria-label", `Remove filter ${filter.label}`);
      button.addEventListener("click", () => removeFilter(filter));
      elements.activeFilters.append(button);
    });
  }

  function removeFilter(filter) {
    if (filter.type === "facet") {
      const leaves = filter.leaves || [filter.value];
      leaves.forEach((leaf) => {
        state.selected[filter.key].delete(leaf);
        state.draftSelected[filter.key].delete(leaf);
      });
    } else if (filter.key === "keyword") {
      state.criteria.keyword = "";
      elements.keyword.value = "";
    } else if (filter.key === "location") {
      state.criteria.location = "";
      elements.location.value = "";
    } else if (filter.key === "nationwide") {
      state.criteria.nationwide = false;
      elements.nationwide.checked = false;
    } else if (filter.key === "homeworking") {
      state.criteria.homeworking = false;
      elements.homeworking.checked = false;
    }
    state.page = 1;
    updateResults();
  }

  function renderJob(job) {
    const saved = state.saved.has(job.id);
    const remoteText = job.remote ? " · Remote available" : "";
    return `
      <article class="job-card">
        <div class="job-card__content">
          <div class="job-card__header">
            <div class="job-card__title-row">
              <h3 class="job-card__title"><a href="#">${escapeHtml(job.title)}</a></h3>
              ${job.badge ? `<span class="job-card__badge">${escapeHtml(job.badge)}</span>` : ""}
            </div>
            <div class="job-card__detail">
              <div class="job-card__meta">
                <span>${escapeHtml(job.location)}${escapeHtml(remoteText)}</span>
                <span>${escapeHtml(job.salary)}</span>
                <span>${escapeHtml(job.company)}</span>
              </div>
              <img class="job-card__logo" src="assets/company-logo.png" alt="${escapeHtml(job.company)} logo">
            </div>
          </div>
          <p class="job-card__summary">${escapeHtml(job.summary)}</p>
        </div>
        <div class="job-card__footer">
          <button class="job-card__details" type="button">View details</button>
          <div class="job-card__actions">
            <span class="job-card__posted">${job.postedDays} day${job.postedDays === 1 ? "" : "s"} ago</span>
            <button class="job-card__save${saved ? " is-saved" : ""}" type="button" data-save="${job.id}" aria-pressed="${saved}">
              <img class="job-card__save-icon" src="assets/star-hollow.svg" alt="">
              <span>${saved ? "Saved" : "Save job"}</span>
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderPagination(totalJobs) {
    const pages = Math.ceil(totalJobs / pageSize);
    if (pages <= 1) {
      elements.pagination.hidden = true;
      elements.pagination.replaceChildren();
      return;
    }

    elements.pagination.hidden = false;
    const buttons = [
      `<button class="page-button" type="button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>‹ Previous</button>`
    ];
    for (let page = 1; page <= pages; page += 1) {
      buttons.push(
        `<button class="page-button" type="button" data-page="${page}" ${page === state.page ? 'aria-current="page"' : ""}>${page}</button>`
      );
    }
    buttons.push(
      `<button class="page-button" type="button" data-page="${state.page + 1}" ${state.page === pages ? "disabled" : ""}>Next ›</button>`
    );
    elements.pagination.innerHTML = buttons.join("");
  }

  function renderJobs(result) {
    const pages = Math.max(1, Math.ceil(result.length / pageSize));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * pageSize;
    const visible = result.slice(start, start + pageSize);

    if (visible.length === 0) {
      elements.list.innerHTML = `
        <div class="empty-state">
          <h3>No jobs match your search</h3>
          <p>Try removing a filter, increasing the distance, or using a broader keyword.</p>
        </div>`;
    } else {
      elements.list.innerHTML = visible.map(renderJob).join("");
    }
    renderPagination(result.length);
  }

  function updateResults() {
    const result = filteredJobs();
    elements.count.textContent = `Found ${result.length.toLocaleString()} job${result.length === 1 ? "" : "s"}`;
    renderFacets();
    renderActiveFilters();
    renderJobs(result);
    updatePendingNote();
  }

  function clearAll() {
    elements.form.reset();
    elements.distance.value = "20";
    facets.forEach(({ key }) => {
      state.selected[key].clear();
      state.draftSelected[key].clear();
    });
    state.criteria = {
      keyword: "",
      location: "",
      distance: 20,
      nationwide: false,
      homeworking: false
    };
    state.page = 1;
    updateResults();
  }

  elements.locationOptions.innerHTML = locations
    .map(({ name }) => `<option value="${escapeHtml(name)}"></option>`)
    .join("");

  elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    readSearchFields();
    applyDraftFilters();
    updateResults();
    document.querySelector("#results-heading").focus?.();
  });

  elements.form.addEventListener("input", updatePendingNote);
  elements.form.addEventListener("change", updatePendingNote);

  elements.clear.addEventListener("click", clearAll);

  elements.facetGroups.addEventListener("toggle", (event) => {
    const details = event.target.closest("details[data-group]");
    if (!details) return;
    if (details.open) state.expanded.add(details.dataset.group);
    else state.expanded.delete(details.dataset.group);
  }, true);

  elements.facetGroups.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-toggle-branch]");
    if (!toggle) return;
    event.preventDefault();
    const branchId = toggle.dataset.toggleBranch;
    const branch = toggle.closest(".facet-branch");
    const open = !state.branchOpen.has(branchId);
    if (open) state.branchOpen.add(branchId);
    else state.branchOpen.delete(branchId);
    branch.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", `${open ? "Collapse" : "Expand"} ${branchId.split(":")[1]}`);
    toggle.querySelector("img").src = open ? "assets/triangle-down.svg" : "assets/triangle-right.svg";
  });

  elements.facetGroups.addEventListener("change", (event) => {
    const input = event.target.closest("input[data-facet]");
    if (!input) return;
    const key = input.dataset.facet;
    if (input.dataset.parent) {
      leavesForParent(key, input.dataset.parent).forEach((leaf) => {
        if (input.checked) state.draftSelected[key].add(leaf);
        else state.draftSelected[key].delete(leaf);
      });
      syncParentCheckbox(key, input.dataset.parent);
    } else {
      if (input.checked) state.draftSelected[key].add(input.value);
      else state.draftSelected[key].delete(input.value);
      const parent = parentForLeaf(key, input.value);
      if (parent) syncParentCheckbox(key, parent);
    }
    updateFacetSelectedCount(key);
    updatePendingNote();
  });

  function syncParentCheckbox(key, parentLabel) {
    const input = elements.facetGroups.querySelector(`input[data-facet="${key}"][data-parent="${parentLabel}"]`);
    if (!input) return;
    const leaves = leavesForParent(key, parentLabel);
    const selectedCount = leaves.filter((leaf) => state.draftSelected[key].has(leaf)).length;
    input.checked = selectedCount === leaves.length && leaves.length > 0;
    input.indeterminate = selectedCount > 0 && selectedCount < leaves.length;
    const branch = input.closest(".facet-branch");
    branch?.querySelectorAll("input[data-leaf]").forEach((leafInput) => {
      leafInput.checked = state.draftSelected[key].has(leafInput.value);
    });
  }

  elements.list.addEventListener("click", (event) => {
    const saveButton = event.target.closest("[data-save]");
    if (!saveButton) return;
    const id = Number(saveButton.dataset.save);
    if (state.saved.has(id)) state.saved.delete(id);
    else state.saved.add(id);
    renderJobs(filteredJobs());
  });

  elements.pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button || button.disabled) return;
    state.page = Number(button.dataset.page);
    renderJobs(filteredJobs());
    elements.list.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateResults();
})();
