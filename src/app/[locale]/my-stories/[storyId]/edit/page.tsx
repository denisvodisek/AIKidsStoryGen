'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  EyeIcon,
  SaveIcon,
  DownloadIcon,
  RefreshCwIcon,
  WandIcon,
  XIcon,
} from 'lucide-react';
import { StoryPage, GeneratedStory } from '@/types';
import { useTranslations } from 'next-intl';

interface Story extends Omit<GeneratedStory, 'pages'> {
  story_pages: (StoryPage & { id: string })[];
}

export default function StoryEditPage() {
  const params = useParams();
  const storyId = params?.storyId as string;
  const t = useTranslations('storyEdit');

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

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
        body: JSON.stringify({
          pageUpdates,
          storyTitle: story.story_title,
        }),
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

  // Title editing functions
  const startTitleEdit = () => {
    setTempTitle(story?.story_title || '');
    setIsEditingTitle(true);
  };

  const saveTitleEdit = () => {
    if (!story || !tempTitle.trim()) return;

    setStory({
      ...story,
      story_title: tempTitle.trim(),
    });
    setUnsavedChanges(true);
    setIsEditingTitle(false);
  };

  const cancelTitleEdit = () => {
    setTempTitle('');
    setIsEditingTitle(false);
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTitleEdit();
    } else if (e.key === 'Escape') {
      cancelTitleEdit();
    }
  };

  // Download current page image
  const handleDownloadImage = async () => {
    if (!selectedPage?.photo_url) return;

    try {
      setDownloading(true);
      const response = await fetch(selectedPage.photo_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${story?.story_title || 'story'}-page-${selectedPage.page_number}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  // Regenerate current page image
  const handleRegenerateImage = async () => {
    if (!selectedPage) return;

    try {
      setRegenerating(true);

      // TODO: Replace with actual regeneration API call
      const response = await fetch(`/api/stories/${storyId}/regenerate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: selectedPage.id,
          description: selectedPage.photo_description,
        }),
      });

      if (response.ok) {
        const { photo_url } = await response.json();

        // Update the page with new image
        handlePageUpdate(selectedPage.id, { photo_url });
        setUnsavedChanges(true);

        console.log('✅ Image regenerated successfully');
      }
    } catch (error) {
      console.error('❌ Error regenerating image:', error);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="inset-0">
        {/* Magical Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-pink-800 transition-all duration-1000 ease-in-out">
          {/* Floating magical elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-16 left-4 h-2 w-2 animate-pulse rounded-full bg-yellow-300/50 opacity-70 sm:top-24 sm:left-20 sm:h-3 sm:w-3"></div>
            <div className="absolute top-32 right-4 h-1 w-1 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s] sm:top-40 sm:right-28 sm:h-2 sm:w-2"></div>
            <div className="absolute bottom-32 left-1/4 h-3 w-3 animate-pulse rounded-full bg-blue-300/40 opacity-60 [animation-delay:-1s] sm:bottom-40 sm:h-4 sm:w-4"></div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/emojis/Magic-Wand.png"
                alt="Magic Wand"
                width={64}
                height={64}
                className="animate-pulse"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">{t('loading')}</h2>
            <p className="text-white/80">{t('subloading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="inset-0">
        {/* Magical Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-pink-800">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-16 left-4 h-2 w-2 animate-pulse rounded-full bg-yellow-300/50 opacity-70"></div>
            <div className="absolute top-32 right-4 h-1 w-1 animate-pulse rounded-full bg-pink-300/60 opacity-80"></div>
          </div>
        </div>

        {/* Error Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/emojis/Hear-No-Evil-Monkey.png"
                alt="Story Not Found"
                width={64}
                height={64}
              />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-white">
              {t('notFound.title')}
            </h1>
            <p className="mb-6 text-white/80">{t('notFound.subtitle')}</p>
            <Link
              href="/my-stories"
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {t('notFound.cta')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inset-0">
      {/* Magical Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-pink-800 transition-all duration-1000 ease-in-out">
        {/* Floating magical elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 left-4 h-2 w-2 animate-pulse rounded-full bg-yellow-300/50 opacity-70 sm:top-24 sm:left-20 sm:h-3 sm:w-3"></div>
          <div className="absolute top-32 right-4 h-1 w-1 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s] sm:top-40 sm:right-28 sm:h-2 sm:w-2"></div>
          <div className="absolute bottom-32 left-1/4 h-3 w-3 animate-pulse rounded-full bg-blue-300/40 opacity-60 [animation-delay:-1s] sm:bottom-40 sm:h-4 sm:w-4"></div>
          <div className="absolute top-2/3 right-1/3 h-2 w-2 animate-pulse rounded-full bg-purple-300/50 opacity-70 [animation-delay:-1.5s] sm:h-3 sm:w-3"></div>

          <div className="absolute top-20 right-4 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-lg [animation-delay:-0.8s] sm:top-28 sm:right-20 sm:h-16 sm:w-16"></div>
          <div className="absolute bottom-20 left-4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-lg [animation-delay:-1.3s] sm:bottom-28 sm:left-20 sm:h-20 sm:w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/my-stories"
                  className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('header.back')}</span>
                </Link>
                <div className="hidden h-6 w-px bg-white/30 sm:block"></div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/emojis/Writing-Hand.png"
                    alt="Writing"
                    width={24}
                    height={24}
                  />
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2">
                      <span className="hidden text-lg text-white sm:inline">
                        {t('header.editTitle')}{' '}
                      </span>
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={e => setTempTitle(e.target.value)}
                        onKeyDown={handleTitleKeyPress}
                        onBlur={saveTitleEdit}
                        className="w-90 rounded-lg border-2 border-pink-400 bg-white/10 px-3 py-1 text-lg font-bold text-white backdrop-blur-sm placeholder:text-white/60 focus:ring-2 focus:ring-pink-100/20 focus:outline-none"
                        placeholder={t('header.titlePlaceholder')}
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={saveTitleEdit}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 p-1 text-white hover:bg-green-600"
                          title={t('header.saveTitle')}
                        >
                          <SaveIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelTitleEdit}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                          title={t('header.cancelEdit')}
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-all hover:bg-white/10"
                      onClick={startTitleEdit}
                      title="Click to edit title"
                    >
                      <h1 className="text-lg font-bold text-white">
                        <span className="hidden sm:inline">
                          {t('header.editTitle')}{' '}
                        </span>
                        {story.story_title}
                      </h1>
                      <Image
                        src="/emojis/Pencil.png"
                        alt="Edit"
                        width={16}
                        height={16}
                        className="opacity-0 transition-opacity group-hover:opacity-60"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {unsavedChanges && (
                  <div className="flex items-center gap-1 text-sm text-yellow-300">
                    <Image
                      src="/emojis/Pencil.png"
                      alt="Unsaved"
                      width={16}
                      height={16}
                    />
                    <span className="hidden sm:inline">
                      {t('header.unsavedChanges')}
                    </span>
                  </div>
                )}
                <Link
                  href={`/my-stories/${storyId}/preview`}
                  className="flex items-center gap-2 rounded-lg bg-white/30 px-3 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('header.preview')}</span>
                </Link>
                <button
                  onClick={handleSave}
                  disabled={saving || !unsavedChanges}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 px-4 py-2 font-semibold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SaveIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {saving ? t('header.saving') : t('header.save')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Layout */}
        <div className="container mx-auto flex gap-6 p-4">
          {/* Left Panel - Page List */}
          <div className="w-80 shrink-0">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2">
                <Image
                  src="/emojis/Books.png"
                  alt="Pages"
                  width={24}
                  height={24}
                />
                <h3 className="text-lg font-bold text-white">
                  {t('sidebar.title')}
                </h3>
              </div>

              <div className="space-y-3">
                {story.story_pages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPageId(page.id)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      selectedPageId === page.id
                        ? 'border-pink-400 bg-white/20 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="mb-3 aspect-[4/3] overflow-hidden rounded-lg bg-white/20">
                      {page.photo_url ? (
                        <img
                          src={page.photo_url}
                          alt={`Page ${page.page_number}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Image
                            src="/emojis/Magic-Wand.png"
                            alt="No Image"
                            width={32}
                            height={32}
                            className="opacity-70"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-white">
                        {t('sidebar.page')} {page.page_number}
                      </div>
                      <div className="text-sm text-white/70 capitalize">
                        {t(
                          `sidebar.pageType.${page.page_type.toLowerCase()}` as any
                        )}
                      </div>
                      <div className="truncate text-xs text-white/60">
                        {page.content.substring(0, 50)}...
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Page Editor */}
          <div className="flex-1">
            {selectedPage ? (
              <div className="sticky top-20 rounded-2xl bg-white/10 p-8 backdrop-blur-md">
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-end gap-2">
                      <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                        <Image
                          src="/emojis/Star.png"
                          alt="Star"
                          width={24}
                          height={24}
                        />
                        {t('editor.page')} {selectedPage.page_number}
                      </h2>
                      <p className="text-white/80 capitalize">
                        {t(
                          `editor.pageType.${selectedPage.page_type.toLowerCase()}` as any
                        )}{' '}
                        •
                        {selectedPage.page_type === 'cover' &&
                          t('editor.pageType.cover')}
                        {selectedPage.page_type === 'story_page' &&
                          t('editor.pageType.story_page')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Image Preview */}
                  <div>
                    <label className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                      <Image
                        src="/emojis/Camera.png"
                        alt="Camera"
                        width={20}
                        height={20}
                      />
                      {t('editor.currentImage')}
                    </label>

                    <div className="overflow-hidden rounded-xl border-2 border-white/20 bg-white/5 p-4">
                      {selectedPage.photo_url ? (
                        <div className="relative">
                          <img
                            src={selectedPage.photo_url}
                            alt={`Page ${selectedPage.page_number}`}
                            className="mx-auto max-h-80 rounded-lg object-contain shadow-2xl"
                          />

                          {/* Image overlay buttons */}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={handleDownloadImage}
                              disabled={downloading}
                              className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleRegenerateImage}
                              disabled={regenerating}
                              className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                            >
                              {regenerating ? (
                                <RefreshCwIcon className="h-4 w-4 animate-spin" />
                              ) : (
                                <WandIcon className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-80 flex-col items-center justify-center text-center">
                          <Image
                            src="/emojis/Sparkles.png"
                            alt="No Image"
                            width={64}
                            height={64}
                            className="mb-4 opacity-70"
                          />
                          <p className="mb-2 text-lg text-white">
                            {t('editor.noImage')}
                          </p>
                          <p className="text-white/70">
                            {t('editor.noImageSubtitle')}
                          </p>

                          {selectedPage.photo_description && (
                            <button
                              onClick={handleRegenerateImage}
                              disabled={regenerating}
                              className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-2 font-semibold text-white transition-all hover:scale-105"
                            >
                              {regenerating ? (
                                <RefreshCwIcon className="h-4 w-4 animate-spin" />
                              ) : (
                                <WandIcon className="h-4 w-4" />
                              )}
                              {t('editor.generateImage')}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                      <Image
                        src="/emojis/Pencil.png"
                        alt="Pencil"
                        width={20}
                        height={20}
                      />
                      {t('editor.pageContent')}
                    </label>

                    <textarea
                      value={selectedPage.content}
                      onChange={e =>
                        handlePageUpdate(selectedPage.id, {
                          content: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border-2 border-white/20 bg-white/10 p-4 font-serif text-lg text-white backdrop-blur-sm placeholder:text-white/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-100/20 focus:outline-none"
                      rows={8}
                      placeholder={t('editor.contentPlaceholder')}
                    />
                    <p className="mt-2 flex items-start gap-1 text-sm text-white/70">
                      <Image
                        src="/emojis/Sparkles.png"
                        alt="Sparkles"
                        width={16}
                        height={16}
                      />
                      {t('editor.contentText')}
                    </p>
                  </div>

                  {/* Photo Description Editor */}
                  {/* <div>
                    <label className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                      <Image
                        src="/emojis/Magic-Wand.png"
                        alt="Magic Wand"
                        width={20}
                        height={20}
                      />
                      Image Description
                    </label>

                    <textarea
                      value={selectedPage.photo_description}
                      onChange={e =>
                        handlePageUpdate(selectedPage.id, {
                          photo_description: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border-2 border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm placeholder:text-white/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-100/20 focus:outline-none"
                      rows={4}
                      placeholder="Describe what the magical image should show..."
                    />
                    <p className="mt-2 flex items-start gap-1 text-sm text-white/70">
                      <Image
                        src="/emojis/Robot.png"
                        alt="AI"
                        width={16}
                        height={16}
                      />
                      This guides our AI when generating or regenerating images.
                    </p>
                  </div> */}
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                <div className="text-center">
                  <Image
                    src="/emojis/Magic-Wand.png"
                    alt="Magic Wand"
                    width={64}
                    height={64}
                    className="mx-auto mb-4 opacity-70"
                  />
                  <p className="text-xl text-white">{t('editor.selectPage')}</p>
                  <p className="text-white/70">
                    {t('editor.selectPageSubtitle')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
