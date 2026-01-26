import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No Items" description="Add some items to get started" />);

    expect(screen.getByText('No Items')).toBeInTheDocument();
    expect(screen.getByText('Add some items to get started')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(
      <EmptyState
        title="No Items"
        action={<button>Create New</button>}
      />
    );

    expect(screen.getByText('Create New')).toBeInTheDocument();
  });
});
