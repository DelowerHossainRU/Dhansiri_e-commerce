import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Calendar, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import api from '../../api/client';
import { formatDate } from '../../utils/format';
import { Skeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/cms/blog/${slug}`);
        if (res.success && res.data) {
          setPost(res.data.post);
          setRecentPosts(res.data.recentPosts || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="aspect-16/9 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif-display text-2xl font-bold text-slate-900 mb-4">Article Not Found</h2>
        <Link to="/blog"><Button variant="primary">Return to Journal</Button></Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-slate-900 font-semibold mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
      </Link>

      <header className="space-y-4 mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-emerald-800">
          {post.category}
        </span>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717A] pt-2 border-t border-slate-200">
          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-emerald-800" /> {post.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} min read</span>
        </div>
      </header>

      <div className="aspect-16/9 overflow-hidden rounded-xs border border-slate-200 mb-10">
        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Body content */}
      <div className="prose prose-neutral max-w-none text-[#27272A] text-sm sm:text-base leading-relaxed font-light space-y-6">
        {post.content.split('\n\n').map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-8 mt-12 border-t border-slate-200">
          <span className="text-xs font-semibold text-[#71717A] mr-2">Tags:</span>
          {post.tags.map((t, idx) => (
            <span key={idx} className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xs text-[#52525B]">
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Recent Related */}
      {recentPosts.length > 0 && (
        <div className="pt-16 mt-16 border-t border-slate-200">
          <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-6">Related Journal Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recentPosts.map((r) => (
              <Link key={r._id} to={`/blog/${r.slug}`} className="group block space-y-2">
                <div className="aspect-16/9 overflow-hidden bg-slate-50 rounded-xs border border-slate-200">
                  <img src={r.featuredImage} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="font-serif-display text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-2">
                  {r.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
