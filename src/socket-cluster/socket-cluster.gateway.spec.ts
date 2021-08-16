import { Test, TestingModule } from '@nestjs/testing';
import { SocketClusterGateway } from './socket-cluster.gateway';

describe('SocketClusterGateway', () => {
  let gateway: SocketClusterGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketClusterGateway],
    }).compile();

    gateway = module.get<SocketClusterGateway>(SocketClusterGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
