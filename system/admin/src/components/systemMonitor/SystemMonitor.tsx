import { TSystemUsage } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import prettyBytes from 'pretty-bytes';
import React from 'react';

import LoadBox from '../../components/loadBox/LoadBox';
import commonStyles from '../../styles/common.module.scss';
import Modal from '../modal/Modal';
import { getCmsCpuUsageOption, getCmsMemoryUsageOption, getCpuUsageOption, getPieOption } from './chartOptions';
import styles from './SystemMonitor.module.scss';

export default class SystemMonitor extends React.Component<
  {
    open: boolean;
    onClose: () => any;
  },
  {
    system?: TSystemUsage;
  }
> {
  private echarts;
  private cpuUsageChart;
  private ramUsageChart;
  private diskUsageChart;
  private cmsCpuUsageChart;
  private cmsRamUsageChart;
  private interval;

  componentDidMount() {
    if (this.props.open) this.onOpen();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) this.onOpen();
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    this.cpuUsageChart?.dispose();
    this.ramUsageChart?.dispose();
    this.diskUsageChart?.dispose();
    this.cmsCpuUsageChart?.dispose();
    this.cmsRamUsageChart?.dispose();
  }

  private onOpen = async () => {
    if (!this.echarts) {
      const echarts = await import('echarts');
      this.echarts = echarts;
    }

    const system = await this.getSystemUsage();
    if (this.props.open && system) {
      this.updateGraphs(system);
    }

    this.interval = setInterval(async () => {
      if (this.props.open) {
        const system = await this.getSystemUsage();
        this.updateGraphs(system);
      }
    }, 2000);
  };

  private updateGraphs = (system: TSystemUsage) => {
    if (!document.getElementById('cpuUsageChart') || !document.getElementById('ramUsageChart')) return;

    this.cpuUsageChart = this.echarts.init(document.getElementById('cpuUsageChart'));
    this.ramUsageChart = this.echarts.init(document.getElementById('ramUsageChart'));
    this.diskUsageChart = this.echarts.init(document.getElementById('diskUsageChart'));
    this.cmsCpuUsageChart = this.echarts.init(document.getElementById('cmsCpuUsageChart'));
    this.cmsRamUsageChart = this.echarts.init(document.getElementById('cmsRamUsageChart'));

    this.cpuUsageChart?.setOption(getCpuUsageOption(this.echarts, system?.cpuUsage?.previousLoads ?? []));

    this.cmsCpuUsageChart?.setOption(getCmsCpuUsageOption(this.echarts, system?.processStats ?? []));
    this.cmsRamUsageChart.setOption(getCmsMemoryUsageOption(this.echarts, system?.processStats ?? []));

    this.ramUsageChart?.setOption(
      getPieOption('RAM', system?.memoryUsage?.available ?? 0, system?.memoryUsage?.used ?? 0),
    );

    this.diskUsageChart?.setOption(
      getPieOption('Disk', system?.diskUsage?.available ?? 0, system?.diskUsage?.used ?? 0),
    );
  };

  private getSystemUsage = async () => {
    try {
      const system = await getRestApiClient()?.getSystemUsage();
      this.setState({ system });
      return system;
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <Modal open={this.props.open} blurSelector="#root" className={commonStyles.center} onClose={this.props.onClose}>
        <div className={styles.SystemMonitor}>
          <h4 className={styles.infoHeader}>System specs</h4>
          {!this.state?.system && <LoadBox size={40} />}
          {this.state?.system && (
            <div className={styles.specsList}>
              <p>
                <b>OS:</b> {this.state?.system?.osInfo?.distro ?? ''} {this.state?.system?.osInfo?.arch ?? ''}
              </p>
              <p>
                <b>CPU:</b> {this.state?.system?.cpuInfo?.manufacturer ?? ''} {this.state?.system?.cpuInfo?.brand ?? ''}
              </p>
              <p>
                <b>RAM:</b> {prettyBytes(this.state?.system?.memoryUsage?.total ?? 0)}
              </p>
              <p>
                <b>Disk:</b> {prettyBytes(this.state?.system?.diskUsage?.size ?? 0)}
              </p>
            </div>
          )}

          <h4 className={styles.infoHeader}>Machine CPU usage</h4>
          <div className={styles.chartBox}>
            {!this.state?.system && <LoadBox size={40} />}
            <div id="cpuUsageChart" className={styles.chart}></div>
          </div>

          <h4 className={styles.infoHeader}>CMS CPU usage</h4>
          <div className={styles.chartBox}>
            {!this.state?.system && <LoadBox size={40} />}
            <div id="cmsCpuUsageChart" className={styles.chart} style={{ height: '450px' }}></div>
          </div>

          <h4 className={styles.infoHeader}>Machine RAM usage</h4>
          <div className={styles.chartBox}>
            {!this.state?.system && <LoadBox size={40} />}
            <div id="ramUsageChart" className={styles.chart}></div>
          </div>

          <h4 className={styles.infoHeader}>CMS RAM usage</h4>
          <div className={styles.chartBox}>
            {!this.state?.system && <LoadBox size={40} />}
            <div id="cmsRamUsageChart" className={styles.chart} style={{ height: '450px' }}></div>
          </div>

          <h4 className={styles.infoHeader}>Machine Disk usage</h4>
          <div className={styles.chartBox}>
            {!this.state?.system && <LoadBox size={40} />}
            <div id="diskUsageChart" className={styles.chart}></div>
          </div>
        </div>
      </Modal>
    );
  }
}
