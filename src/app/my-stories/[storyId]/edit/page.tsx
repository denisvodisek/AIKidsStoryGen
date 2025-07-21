'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, EyeIcon, SaveIcon } from 'lucide-react';
import { StoryPage, GeneratedStory } from '@/types';

interface Story extends Omit<GeneratedStory, 'pages'> {
  story_pages: (StoryPage & { id: string })[];
}

export default function StoryEditPage() {
  const params = useParams();
  const storyId = params?.storyId as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stories/${storyId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }

        const { story: fetchedStory } = await response.json();
        const sortedStory = {
          ...fetchedStory,
          story_pages: [...fetchedStory.story_pages].sort(
            (a, b) => a.page_number - b.page_number
          ),
        };

        setStory(sortedStory);
        if (sortedStory.story_pages?.length > 0) {
          setSelectedPageId(sortedStory.story_pages[0].id);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  const selectedPage = story?.story_pages?.find(
    page => page.id === selectedPageId
  );

  const handlePageUpdate = (
    pageId: string,
    updates: Partial<StoryPage & { id: string }>
  ) => {
    if (!story) return;

    const updatedStory = {
      ...story,
      story_pages: story.story_pages.map(page =>
        page.id === pageId ? { ...page, ...updates } : page
      ),
    };

    setStory(updatedStory);
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!story || !unsavedChanges) return;

    try {
      setSaving(true);
      const pageUpdates = story.story_pages.map(page => ({
        pageId: page.id,
        content: page.content,
        photo_description: page.photo_description,
      }));

      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageUpdates }),
      });

      if (response.ok) {
        setUnsavedChanges(false);
        console.log('✅ Story saved successfully');
      }
    } catch (error) {
      console.error('❌ Error saving story:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Story Not Found
          </h1>
          <Link
            href="/my-stories"
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/my-stories"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Stories
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-lg font-semibold text-gray-800">
            Edit: {story.story_title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {unsavedChanges && (
            <span className="text-sm text-amber-600">Unsaved changes</span>
          )}
          <Link
            href={`/my-stories/${storyId}/preview`}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4" />
            Preview
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !unsavedChanges}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            <SaveIcon className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Page List */}
        <div className="w-80 overflow-y-auto border-r bg-gray-50">
          <div className="p-4">
            <h3 className="mb-4 font-semibold text-gray-800">Pages</h3>
            <div className="space-y-2">
              {story.story_pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPageId(page.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedPageId === page.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="mb-2 aspect-[4/3] overflow-hidden rounded bg-gray-100">
                    {page.photo_url ? (
                      <img
                        src={page.photo_url}
                        alt={`Page ${page.page_number}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-lg">📖</div>
                          <p className="text-xs">No image</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="font-medium">Page {page.page_number}</div>
                  <div className="text-sm text-gray-500 capitalize">
                    {page.page_type.replace('_', ' ')}
                  </div>
                  <div className="mt-1 truncate text-xs text-gray-400">
                    {page.content.substring(0, 50)}...
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Page Editor */}
        <div className="flex-1 overflow-auto">
          {selectedPage ? (
            <div className="mx-auto max-w-4xl p-6">
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-semibold">
                  Page {selectedPage.page_number} -{' '}
                  {selectedPage.page_type.replace('_', ' ')}
                </h3>
                <div className="text-sm text-gray-500">
                  {selectedPage.page_type === 'cover' && 'Story cover page'}
                  {selectedPage.page_type === 'story_page' &&
                    'Story content page'}
                </div>
              </div>

              <div className="space-y-6">
                {/* Image Preview */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Current Image
                  </label>
                  <div className="rounded-lg border p-4">
                    {selectedPage.photo_url ? (
                      <img
                        src={selectedPage.photo_url}
                        alt={`Page ${selectedPage.page_number}`}
                        className="mx-auto max-h-64 rounded-lg object-contain"
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="mb-2 text-4xl">📖</div>
                          <p>No image generated</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Page Content
                  </label>
                  <textarea
                    value={selectedPage.content}
                    onChange={e =>
                      handlePageUpdate(selectedPage.id, {
                        content: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border p-3 font-serif text-lg focus:border-blue-500 focus:outline-none"
                    rows={8}
                    placeholder="Enter page content..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This text will appear on the page in your story.
                  </p>
                </div>

                {/* Photo Description */}
                <div>
                  <label className="mb-2 block font-medium text-gray-700">
                    Image Description
                  </label>
                  <textarea
                    value={selectedPage.photo_description}
                    onChange={e =>
                      handlePageUpdate(selectedPage.id, {
                        photo_description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="Describe what the image should show..."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This guides the AI when generating images.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="mb-2 text-4xl">📝</div>
                <p>Select a page to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
