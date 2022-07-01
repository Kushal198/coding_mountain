import prisma from '../../db/prisma';

interface CreateUser {
  uuid: string;
  id: number;
}

interface CreateCoin {
  id: number;
  name: string;
  code: string;
  rank: number;
  image: string;
  price: string;
  marketCap: string;
  h24: string;
}

export async function createCoin(coin: CreateCoin) {
  return await prisma.coin.create({
    data: coin,
  });
}

interface UpdateCoin {
  id: number;
  rank: number;
  price: string;
  marketCap: string;
  h24: string;
}

export async function updateCoin(coin: UpdateCoin) {
  return await prisma.coin.update({
    where: { id: coin.id },
    data: coin,
  });
}

export async function createClient(user: CreateUser) {
  return await prisma.client.create({
    data: user,
  });
}

interface UpdateUser {
  id: number;
  uuid: string;
}

export async function updateClient(user: UpdateUser) {
  return await prisma.client.update({
    where: { id: user.id },
    data: user,
  });
}
