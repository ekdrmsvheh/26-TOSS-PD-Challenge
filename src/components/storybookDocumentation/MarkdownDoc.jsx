import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import { SectionTitle } from './SectionTitle';

/**
 * MarkdownDoc 컴포넌트
 *
 * 기획 문서(docs/product/**.md) 원문을 Storybook Doc 스토리에 그대로 옮기기 위한 경량 마크다운 렌더러.
 * 문서마다 표/목록/코드블록을 손으로 옮겨 적는 대신, 허용된 문서 프리미티브(Typography, Table, SectionTitle,
 * Box component="pre")로만 매핑해 "공식 기술 문서 스타일" 규칙을 자동으로 지킨다.
 *
 * 지원 블록: #~#### 헤딩(h1→페이지 제목, h2→SectionTitle, h3/h4→소제목),
 * 표(| ... |), 순서/비순서 목록(-, *, └, 1.), 인용(>), 코드펜스(```), 구분선(---), 문단.
 * 인라인: **bold**, `code`, [text](url)(비활성 텍스트로 표시).
 *
 * Props:
 * @param {string} content - 렌더링할 마크다운 원문 [Required]
 *
 * Example usage:
 * <MarkdownDoc content={rawMarkdownString} />
 */

function parseInline(text, keyPrefix) {
  const nodes = [];
  const regex = /(\*\*.+?\*\*|`.+?`|\[.+?\]\(.+?\))/g;
  const parts = text.split(regex).filter((part) => part !== '');

  parts.forEach((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(
        <Box key={key} component="span" sx={{ fontWeight: 700 }}>
          {part.slice(2, -2)}
        </Box>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(
        <Box
          key={key}
          component="code"
          sx={{ fontFamily: 'monospace', fontSize: '0.85em', bgcolor: 'grey.100', px: '4px', borderRadius: '4px' }}
        >
          {part.slice(1, -1)}
        </Box>
      );
    } else {
      const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/);
      if (linkMatch) {
        nodes.push(
          <Box
            key={key}
            component="span"
            sx={{ color: 'text.secondary', borderBottom: '1px dotted', borderColor: 'divider' }}
          >
            {linkMatch[1]}
          </Box>
        );
      } else {
        nodes.push(part);
      }
    }
  });

  return nodes;
}

function parseTableRow(line) {
  const trimmed = line.trim().replace(/^\||\|$/g, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

function isTableSeparator(line) {
  const cells = parseTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-+:?$/.test(cell));
}

function parseBlocks(content) {
  const lines = content.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      i += 1;
      continue;
    }

    // Code fence
    if (trimmed.startsWith('```')) {
      const codeLines = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // skip closing fence
      blocks.push({ type: 'code', content: codeLines.join('\n') });
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i += 1;
      continue;
    }

    // Table
    if (trimmed.startsWith('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = parseTableRow(lines[i]);
      const aligns = parseTableRow(lines[i + 1]).map((cell) => {
        if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
        if (cell.endsWith(':')) return 'right';
        return 'left';
      });
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parseTableRow(lines[i]));
        i += 1;
      }
      blocks.push({ type: 'table', header, aligns, rows });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', lines: quoteLines });
      continue;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    // List (unordered: -, *, └ / ordered: 1.)
    if (/^([-*└]|\d+\.)\s+/.test(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed);
      const items = [];
      while (i < lines.length && /^([-*└]|\d+\.)\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^([-*└]|\d+\.)\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    // Paragraph (single line)
    blocks.push({ type: 'paragraph', text: trimmed });
    i += 1;
  }

  return blocks;
}

export function MarkdownDoc({ content }) {
  const blocks = parseBlocks(content);

  return (
    <>
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        if (block.type === 'heading') {
          if (block.level === 1) {
            return (
              <Typography key={key} variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                {parseInline(block.text, key)}
              </Typography>
            );
          }
          if (block.level === 2) {
            return <SectionTitle key={key} title={block.text} />;
          }
          if (block.level === 3) {
            return (
              <Typography key={key} variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>
                {parseInline(block.text, key)}
              </Typography>
            );
          }
          return (
            <Typography key={key} variant="subtitle2" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
              {parseInline(block.text, key)}
            </Typography>
          );
        }

        if (block.type === 'quote') {
          return (
            <Box
              key={key}
              sx={{ borderLeft: '3px solid', borderColor: 'divider', pl: 2, py: 0.5, mb: 2 }}
            >
              {block.lines.map((line, lineIndex) => (
                <Typography
                  key={`${key}-${lineIndex}`}
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  {parseInline(line, `${key}-${lineIndex}`)}
                </Typography>
              ))}
            </Box>
          );
        }

        if (block.type === 'table') {
          return (
            <TableContainer key={key} sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {block.header.map((cell, cellIndex) => (
                      <TableCell
                        key={`${key}-h-${cellIndex}`}
                        sx={{ fontWeight: 600, textAlign: block.aligns[cellIndex] || 'left' }}
                      >
                        {parseInline(cell, `${key}-h-${cellIndex}`)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {block.rows.map((row, rowIndex) => (
                    <TableRow key={`${key}-r-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={`${key}-r-${rowIndex}-${cellIndex}`}
                          sx={{ textAlign: block.aligns[cellIndex] || 'left' }}
                        >
                          {parseInline(cell, `${key}-r-${rowIndex}-${cellIndex}`)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }

        if (block.type === 'code') {
          return (
            <Box
              key={key}
              component="pre"
              sx={{
                backgroundColor: 'grey.100',
                p: 2,
                fontSize: 12,
                fontFamily: 'monospace',
                overflow: 'auto',
                borderRadius: 1,
                mb: 3,
              }}
            >
              {block.content}
            </Box>
          );
        }

        if (block.type === 'list') {
          return (
            <Stack key={key} spacing={0.75} sx={{ mb: 2, pl: 1 }}>
              {block.items.map((item, itemIndex) => (
                <Stack key={`${key}-${itemIndex}`} direction="row" spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {block.ordered ? `${itemIndex + 1}.` : '•'}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {parseInline(item, `${key}-${itemIndex}`)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          );
        }

        if (block.type === 'hr') {
          return <Divider key={key} sx={{ my: 3 }} />;
        }

        return (
          <Typography key={key} variant="body2" sx={{ mb: 1.5, lineHeight: 1.7 }}>
            {parseInline(block.text, key)}
          </Typography>
        );
      })}
    </>
  );
}
