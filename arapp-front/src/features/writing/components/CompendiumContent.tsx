import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./CompendiumContent.module.css";

interface CompendiumContentProps {
    title: string;
    subtitle?: string;
    content: string;
}

function CompendiumContent({ title, subtitle, content }: CompendiumContentProps) {
    return (
        <div className={styles.articleContent}>
            <h1 className={styles.articleTitle}>
                {title}
            </h1>
            {subtitle && (
                <div className={styles.articleSubtitle}>{subtitle}</div>
            )}
            <div className={styles.markdownWrapper}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default CompendiumContent;
