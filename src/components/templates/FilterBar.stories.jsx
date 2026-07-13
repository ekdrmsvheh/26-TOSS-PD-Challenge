import { useState } from 'react';
import { FilterBar } from './FilterBar';

const ALL_TAGS = ['mood', 'color', 'layout', 'reference'];

export default {
  title: 'Template/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export const Default = {
  render: () => {
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');

    const toggleTag = (tag) => {
      setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    };

    return (
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        availableTags={ALL_TAGS}
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
        onClearFilters={() => {
          setSearch('');
          setSelectedTags([]);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={12}
      />
    );
  },
};
