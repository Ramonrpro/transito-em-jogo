import { IDBFactory } from 'fake-indexeddb';
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ProvedorDados } from './contexto.tsx';

test('banco desatualizado mostra "Atualize o app" com Recarregar', async () => {
  const fabrica = new IDBFactory();
  await new Promise<void>((ok) => { const r = fabrica.open('transito-em-jogo', 3); r.onsuccess = () => { r.result.close(); ok(); }; });
  render(<ProvedorDados fabrica={fabrica}><p>app</p></ProvedorDados>);
  expect(await screen.findByRole('heading', { name: 'Atualize o app' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Recarregar' })).toBeInTheDocument();
  expect(screen.queryByText('app')).not.toBeInTheDocument();
});
