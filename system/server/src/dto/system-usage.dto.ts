import { ApiProperty } from '@nestjs/swagger';
import { TSystemUsage } from '@cromwell/core';

export class SystemUsageDto implements TSystemUsage {
  @ApiProperty()
  osInfo: TSystemUsage['osInfo'];

  @ApiProperty()
  cpuInfo: TSystemUsage['cpuInfo'];

  @ApiProperty()
  cpuUsage: TSystemUsage['cpuUsage'];

  @ApiProperty()
  diskUsage: TSystemUsage['diskUsage'];

  @ApiProperty()
  memoryUsage: TSystemUsage['memoryUsage'];

  parseSysInfo(info: any) {
    this.osInfo = {
      arch: info?.osInfo?.arch,
      distro: info?.osInfo?.distro,
      platform: info?.osInfo?.platform,
    };

    this.cpuInfo = {
      manufacturer: info?.cpu?.manufacturer,
      brand: info?.cpu?.brand,
      cores: info?.cpu?.cores,
      speed: info?.cpu?.speed,
    };

    this.diskUsage = {
      size: info?.fsSize?.[0]?.size,
      available: info?.fsSize?.[0]?.available,
      used: info?.fsSize?.[0]?.used,
    };

    this.memoryUsage = {
      used: info?.mem?.used,
      available: info?.mem?.available,
      total: info?.mem?.total,
    };
    return this;
  }

  parseSysUsage(info: any) {
    this.cpuUsage = {
      currentLoad: info?.currentLoad?.currentLoad,
      currentLoadIdle: info?.currentLoad?.currentLoadIdle,
      previousLoads: [],
    };

    this.diskUsage = {
      size: info?.fsSize?.[0]?.size,
      available: info?.fsSize?.[0]?.available,
      used: info?.fsSize?.[0]?.used,
    };

    this.memoryUsage = {
      used: info?.mem?.used,
      available: info?.mem?.available,
      total: info?.mem?.total,
    };
    return this;
  }
}
